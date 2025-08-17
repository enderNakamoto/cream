import RefinementQuestionsClient from "./refinement-questions-client";

export default async function RefinementQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RefinementQuestionsClient projectId={id} />;
} 