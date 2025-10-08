import React from 'react'
import { H2, P, Ol } from "@/components/typograpy";
import Image from "next/image";

export default async function TransparencyEnsurance() {
  return (
    <div className="w-full justify-center pt-20 pb-12 lg:pb-20 px-10 mb-20 space-y-5 text-white bg-customBlueGray">
        <H2>How do we ensure transparency?</H2>
        <Ol className="mb-16">
          <P>
            At RefreeG, transparency is at the core of our operations. We
            utilize blockchain technology to provide an immutable and
            transparent record of all transactions. {"Here's"} how we ensure
            transparency:
          </P>
          <li className="mb-4 text-lg">
            Blockchain Integration: Every donation and disbursement is recorded
            on the blockchain, creating a public ledger accessible to all
            stakeholders. This ensures that funds are tracked and cannot be
            altered retroactively.
          </li>
          <li className="mb-4 text-lg">
            Real-Time Tracking: Donors can track their contributions in
            real-time, from donation to final allocation, providing assurance
            that funds are used as intended.
          </li>
          <li className="mb-4 text-lg">
            Detailed Reporting: We offer comprehensive reports on the use of
            funds, project outcomes, and the impact created. These reports are
            made publicly available, ensuring accountability.
          </li>
          <li className="mb-4 text-lg">
            Third-Party Audits: Regular audits by independent third parties
            verify the accuracy and integrity of our financial records and
            processes.
          </li>
          <li className="mb-4 text-lg">
            User Verification: Both donors and recipients undergo a verification
            process to ensure legitimacy and prevent fraud.
          </li>
        </Ol>
        <div className="md:flex lg:flex mt-10 mb-10 text-base lg:text-2xl">
          <span className="mr-4">Want to be a part of us?</span>
          <span className="flex mr-1 md:font-semibold lg:font-semibold underline">
            <button className="flex hover:bg-[#434a52] px-1 rounded-xl">
              Join our Community!
              <Image
                src="/images/arrowRight.svg"
                alt="arrow right"
                height={15}
                width={15}
              />
            </button>
          </span>
        </div>
      </div>
  )
}
