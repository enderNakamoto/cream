import GenerateClient from "./generate-client";

export default async function GeneratePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GenerateClient projectId={id} />;
} 