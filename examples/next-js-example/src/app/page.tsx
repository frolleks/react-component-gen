import { ai } from "@/utils/ai";

export default async function Home() {
  const Button = await ai`create a react component of a button`;

  return (
    <div>
      <Button>i am a button</Button>
    </div>
  );
}
