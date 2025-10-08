"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Category {
  id: string
  name: string
}

interface PetitionsFilterProps {
  categories: Category[]
  selectedCategory: string
}

export function PetitionsFilter({ categories, selectedCategory }: PetitionsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams()
    if (categoryId !== "all") {
      params.set("category", categoryId)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative">
      <ScrollArea className="pb-4 w-full">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

