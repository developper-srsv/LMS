export function useToast() {
  return {
    toast: {
      success: (message: string) => alert(`✅ Success: ${message}`),
      error: (message: string) => alert(`❌ Error: ${message}`),
    },
  };
}
