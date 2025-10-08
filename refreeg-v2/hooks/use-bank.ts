import { useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import Paystack from "@/services/paystack"
import type { BankDetailsFormData, ICreateSubaccount } from "@/types"
import { updateBankDetails } from "@/actions"

interface UseBankProps {
    initialData?: {
        account_number: string | null
        bank_name: string | null
        account_name: string | null
        sub_account_code: string | null
    }
    userId: string
}

export function useBank({ initialData, userId }: UseBankProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isLoadingBanks, setIsLoadingBanks] = useState(false)
    const [banks, setBanks] = useState<{ name: string; code: string }[]>([])
    const [formData, setFormData] = useState<BankDetailsFormData>({
        accountNumber: initialData?.account_number || "",
        bankName: initialData?.bank_name || "",
        accountName: initialData?.account_name || "",
        sub_account_code: initialData?.sub_account_code || ""
    })

    // Fetch banks using useEffect
    useEffect(() => {
        const fetchBanks = async () => {
            setIsLoadingBanks(true)
            try {
                const banksList = await Paystack.listBanks()
                // Deduplicate banks list
                const uniqueBanks = banksList.reduce((acc, bank) => {
                    const key = `${bank.code}-${bank.name}`
                    if (!acc.some(b => `${b.code}-${b.name}` === key)) {
                        acc.push(bank)
                    }
                    return acc
                }, [] as { name: string; code: string }[])
                setBanks(uniqueBanks)
            } catch (error) {
                
                toast({
                    title: "Error",
                    description: "Failed to fetch banks list",
                    variant: "destructive"
                })
            } finally {
                setIsLoadingBanks(false)
            }
        }

        fetchBanks()
    }, [])

    // Account verification function
    const verifyAccount = async (accountNumber: string, bankCode: string) => {
        try {
            const verification = await Paystack.verifyAccountNumber(accountNumber, bankCode)
            setFormData(prev => ({
                ...prev,
                accountName: verification.account_name
            }))
            toast({
                title: "Account verified",
                description: "Your bank account details have been verified successfully",
            })
        } catch (error) {
            console.error('Error verifying account:', error)
            toast({
                title: "Verification failed",
                description: "Could not verify the account details. Please check and try again.",
                variant: "destructive"
            })
        } finally {
            setIsVerifying(false)
        }
    }

    // Improved useEffect for account verification
    useEffect(() => {
        if (formData.accountNumber && formData.bankName) {
            const bank = banks.find(b => b.name === formData.bankName)
            if (bank) {
                setIsVerifying(true)
                verifyAccount(formData.accountNumber, bank.code)
            }
        }
    }, [formData.accountNumber, formData.bankName, banks])

    const handleBankChange = (value: string, field: string) => {
        const updatedFormData = {
            ...formData,
            [field]: value
        }
        setFormData(updatedFormData)
    }

    const handleBankSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const bank = banks.find(b => b.name === formData.bankName)
            if (!bank) {
                throw new Error("Bank not found")
            }

            const data: ICreateSubaccount = {
                bank_code: bank.code,
                account_number: formData.accountNumber,
                business_name: formData.accountName,
                percentage_charge: 0
            }

            const sub_account_code = await Paystack.createSubaccount(data)
            await updateBankDetails(userId, { ...formData, sub_account_code: sub_account_code.subaccount_code })

            toast({
                title: "Success",
                description: "Bank details updated successfully",
            })
        } catch (error) {
            console.error('Error updating bank details:', error)
            toast({
                title: "Error",
                description: "Failed to update bank details",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        isSubmitting,
        isVerifying,
        banks,
        isLoadingBanks,
        isVerified: !!formData.accountName,
        formData,
        handleBankChange,
        handleBankSubmit
    }
} 