export function trackMutation(
  mutation: string,
  duration: number,
) {
  console.log("[MUTATION METRIC]", {
    mutation,
    duration,
  });
}
