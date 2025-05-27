"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../src/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import Image from "next/image";


type UserProfile = {
  id: string;
  name?: string;
  bio?: string;
  qualifications?: string;
  profile_photo?: string;
};

export default function InstructorProfile() {
const [user, setUser] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualification] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.log("User not found in instructor/profile page");
      return;
    }

    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();
    console.log(data)

    if (error) console.error("Error fetching user:", error);

    if (data) {
      setUser(data);
      const nameParts = (data.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setBio(data.bio || "");
      setQualification(data.qualifications || "");
      setProfilePhotoUrl(getPublicUrl(data.profile_photo));
    }
  }

  async function handleProfilePhotoUpload() {
    if (!profilePhoto || !user) return;

    setLoading(true);
    const filePath = `profile-photos/${user.id}/photo.jpg`;

    const { error } = await supabase.storage.from("profile-photos").upload(filePath, profilePhoto, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      setLoading(false);
      return;
    }

    await supabase.from("users").update({ profile_photo: filePath }).eq("id", user.id);

    setProfilePhotoUrl(getPublicUrl(filePath));
    setLoading(false);
  }

  function getPublicUrl(filePath: string) {
    if (!filePath) return "";
    const { data } = supabase.storage.from("profile-photos").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update({
        name: `${firstName} ${lastName}`.trim(),
        bio,
        qualifications,
      })
      .eq("id", user.id);

    if (error) console.error("Error updating profile:", error);
    setLoading(false);
  }

  return (
    <div className="container max-w-3xl py-10" style={{margin:"0 auto"}}>
      <h1 className="text-2xl font-bold mb-6 text-center">My Account</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="personalization"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent"
          >
            Personalization
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent"
          >
            Payment Methods
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent"
          >
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {profilePhotoUrl ? (
                      <Image
                        src={profilePhotoUrl || "/placeholder.svg"}
                        alt="Profile Photo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfilePhoto(file);
                          handleProfilePhotoUpload();
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">First name</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)}  />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Last name</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Bio</label>
                  <Input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A brief introduction about yourself"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Qualification</label>
                  <Input
                    value={qualifications}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="Your academic or professional qualification"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder content for other tabs */}
        <TabsContent value="personalization">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Personalization settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Account settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Payment methods coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Privacy settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



