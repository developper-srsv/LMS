"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";

type Stats = {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
};

type EnrollmentWithCourse = {
  created_at: string;
  courses: {
    price: number;
  } | null;
};


type ChartData = {
  name: string;
  enrollments: number;
  revenue: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact" });

      // Fetch total courses
      const { count: courseCount } = await supabase
        .from("courses")
        .select("*", { count: "exact" });

      // Fetch enrollments & related course prices
const { data: enrollments, error: enrollmentsError } = await supabase
  .from("enrollments")
  .select("created_at, courses(price)")
  .order("created_at", { ascending: true }) as {
    data: EnrollmentWithCourse[] | null;
    error: PostgrestError | null;
  };


      if (enrollmentsError) throw enrollmentsError;

      // Calculate total revenue and enrollments
      const totalRevenue =
        enrollments?.reduce((sum, enrollment) => sum + (enrollment.courses?.price || 0), 0) || 0;

      const totalEnrollments = enrollments?.length || 0;

      setStats({
        totalUsers: userCount || 0,
        totalCourses: courseCount || 0,
        totalRevenue,
        totalEnrollments,
      });

      // Prepare chart data for last 6 months
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString("default", { month: "short" });
      }).reverse();

      const chartData = last6Months.map((month) => {
        const monthlyEnrollments = enrollments?.filter((e) =>
          new Date(e.created_at).toLocaleString("default", { month: "short" }) === month
        ).length || 0;

        const monthlyRevenue = enrollments
          ?.filter((e) =>
            new Date(e.created_at).toLocaleString("default", { month: "short" }) === month
          )
          .reduce((sum, e) => sum + (e.courses?.price || 0), 0) || 0;

        return { name: month, enrollments: monthlyEnrollments, revenue: monthlyRevenue };
      });

      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <h3 className="text-2xl font-bold">{stats.totalCourses}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Enrollments</p>
                <h3 className="text-2xl font-bold">{stats.totalEnrollments}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Monthly enrollment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
