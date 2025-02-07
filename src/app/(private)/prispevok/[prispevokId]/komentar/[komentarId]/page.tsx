export default async function Page({
  params
}: {
  params: Promise<{
    prispevokId: string;
    komentarId: string;
  }>
}) {
  const { prispevokId, komentarId } = await params;
  
  // Component logic using resolved parameters
}
