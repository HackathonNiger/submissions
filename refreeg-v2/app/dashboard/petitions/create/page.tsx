import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CreatePetitionForm from "./create-petition-form";

export default async function CreateCausePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="md:container py-10">
      <CreatePetitionForm />
    </div>
  );
}
