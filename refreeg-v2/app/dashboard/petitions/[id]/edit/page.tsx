import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPetition } from "@/actions/petition-actions";
import EditPetitionForm from "./edit-petition-form";

export default async function EditPetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }
  const myParams = await params;
  const petition = await getPetition(myParams.id);

  if (!petition) {
    redirect("/dashboard/petitions");
  }

  // Check if the user owns this petition
  if (petition.user_id !== user.id) {
    redirect("/dashboard/petitions");
  }

  return (
    <div className="md:container py-10">
      <div className="md:mx-auto max-w-2xl">
        <EditPetitionForm petition={petition} />
      </div>
    </div>
  );
}
