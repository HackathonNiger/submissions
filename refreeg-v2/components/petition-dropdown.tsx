"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePetition } from "@/actions";

interface PetitionDropdownProps {
  petitionId: string;
}

export function PetitionDropdown({ petitionId }: PetitionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-1 h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/petitions/${petitionId}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Petition
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/petitions/${petitionId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Petition
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deletePetition(petitionId)}
          className="text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Petition
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
