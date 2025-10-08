'use client'
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import React from "react";

interface LocationSelectorProps {
    selected: string;
    onChange: (value: string) => void;
    mode: 'country' | 'state' | 'city';
    label?: string;
    placeholder?: string;
    countryName?: string; // Required for state mode
    stateName?: string;   // Required for city mode
}

const fetchLocations = async (url: string): Promise<string[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
    return response.json();
};

export function LocationSelector({
    selected,
    onChange,
    mode,
    label = "Location",
    placeholder = "Select location...",
    countryName,
    stateName,
}: LocationSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const fetchCountries = () => fetchLocations("/api/countries");
    const fetchStates = (countryName: string | null): Promise<string[]> => {
        if (!countryName) return Promise.resolve([]);
        return fetchLocations(`/api/states?countryName=${encodeURIComponent(countryName)}`);
    };
    const fetchCities = (stateName: string | null): Promise<string[]> => {
        if (!stateName) return Promise.resolve([]);
        return fetchLocations(`/api/cities?stateName=${encodeURIComponent(stateName)}`);
    };

    const {
        data: countries = [],
        isLoading: isLoadingCountries,
        isError: isErrorCountries,
    } = useQuery<string[]>({
        queryKey: ["countries"],
        queryFn: fetchCountries,
        enabled: mode === 'country',
        staleTime: Infinity,
    });

    const {
        data: states = [],
        isLoading: isLoadingStates,
        isError: isErrorStates,
    } = useQuery<string[]>({
        queryKey: ["states", countryName],
        queryFn: () => fetchStates(countryName ?? null),
        enabled: mode === 'state' && !!countryName,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: cities = [],
        isLoading: isLoadingCities,
        isError: isErrorCities,
    } = useQuery<string[]>({
        queryKey: ["cities", stateName],
        queryFn: () => fetchCities(stateName ?? null),
        enabled: mode === 'city' && !!stateName,
        staleTime: 1000 * 60 * 5,
    });

    const getOptions = () => {
        switch (mode) {
            case 'country':
                return countries;
            case 'state':
                return states;
            case 'city':
                return cities;
        }
    };

    const getLoading = () => {
        switch (mode) {
            case 'country':
                return isLoadingCountries;
            case 'state':
                return isLoadingStates;
            case 'city':
                return isLoadingCities;
        }
    };

    const getError = () => {
        switch (mode) {
            case 'country':
                return isErrorCountries;
            case 'state':
                return isErrorStates;
            case 'city':
                return isErrorCities;
        }
    };

    const handleSelect = (value: string) => {
        onChange(value === selected ? "" : value);
        setIsOpen(false);
    };

    const options = getOptions();
    const isLoading = getLoading();
    const isError = getError();

    return (
        <div className="space-y-0.5">
            <Label className="text-base max-lg:text-sm">{label}</Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild disabled={isLoading || isError}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className={cn(
                            "w-full justify-between text-base font-normal text-secondary-foreground/65 focus-visible:ring-0 focus-visible:ring-offset-0",
                            !selected && "text-secondary-foreground/65",
                            (isLoading || isError) && "cursor-not-allowed opacity-50 z-[1019]"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isError ? (
                            "Error loading data"
                        ) : (
                            selected || placeholder
                        )}
                        {!isLoading && !isError && (
                            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0 z-[9999] overflow-auto custom-scroll">
                    {options.length > 0 ? (
                        <Command>
                            <CommandInput placeholder={`Search ${mode}...`} />
                            <CommandEmpty>No {mode} found.</CommandEmpty>
                            <CommandGroup className="overflow-y-auto !z-50">
                                {options.map((option) => (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={handleSelect}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected === option ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    ) : (
                        <div className="p-4 text-sm text-center text-muted-foreground">
                            No options available.
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
} 