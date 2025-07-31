export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  try {
    const parsed = userRaw ? JSON.parse(userRaw) : {};
    return {
      userId: parsed.userId ?? null,
      token: token ?? null,
    };
  } catch (e) {
    console.error('❌ Failed to parse user');
    return { userId: null, token: null };
  }
}
