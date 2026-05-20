export async function safeMutation<T>(
  mutation: () => Promise<T>,
): Promise<T> {
  try {
    return await mutation();
  } catch (error) {
    console.error("Mutation error:", error);
    throw error;
  }
}
