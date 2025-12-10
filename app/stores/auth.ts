import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("authStore", () => {
  const session = authClient.useSession();
  const user = computed(() => session.value.data?.user);
  const loading = ref(false);

  async function signIn() {
    loading.value = true;
    await nextTick();
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });
    }
    catch (error) {
      console.error("Failed to load providers:", error);
    }
    finally {
      loading.value = false;
    }
  }

  async function signOut() {
    await authClient.signOut();
    navigateTo("/");
  }

  return {
    loading,
    signIn,
    user,
    signOut,
  };
});
