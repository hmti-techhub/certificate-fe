import GetStartedButton from "@/components/button/GetStartedButton";
import PricingButton from "@/components/button/PricingButton";
import ContactCard from "@/components/card/ContactCard";
import PricingCard from "@/components/card/PricingCard";
import DashboardView from "@/components/DashboardView";
import { IAdminContact, IPricingPackage } from "@/lib/types/General";
import { SquareCheckBig } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Certify | HMTI UDINUS",
  description:
    "Certify is a smart and easy-to-use tool developed by the Informatics Student Association (HMTI) to help you generate QR Codes for certificates in just a few clicks.",
};

const LandingPage = async () => {
  const pricingPackage: IPricingPackage[] = [
    {
      id: 1,
      packageName: "🥈 Silver Package",
      packageDescription: "Perfect for Small Events",
      packagePrice: 150000,
      packageFeatures: [
        {
          feature: "Create up to 2 events",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "150 Participants each event",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "QR Code generator included",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "Priority support",
          icon: <SquareCheckBig className="text-redd" />,
        },
        {
          feature: "Exclusive email sending (via external app)",
          icon: <SquareCheckBig className="text-redd" />,
        },
      ],
      packageStyle: "bg-[#FFFB86] border-black",
    },
    {
      id: 2,
      packageName: "💎 Platinum Package",
      packageDescription: "Ideal for Medium-Sized Events",
      packagePrice: 300000,
      packageFeatures: [
        {
          feature: "Create up to 4 events",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "300 Participants each event",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "QR Code generator included",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "Priority support (admin help, lag issues, tutorials)",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "Exclusive email sending (via external app)",
          icon: <SquareCheckBig className="text-redd" />,
        },
      ],
      packageStyle: "bg-[#99B2FF] border-black",
    },
    {
      id: 3,
      packageName: "🏆 Gold Package",
      packageDescription: "Best for Large-Scale Events",
      packagePrice: 500000,
      packageFeatures: [
        {
          feature: "Create up to 6 events",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "600 Participants each event",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "QR Code generator included",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "Priority support (admin help, lag issues, tutorials)",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
        {
          feature: "Exclusive email sending (via external app)",
          icon: <SquareCheckBig className="text-[#5AB95F]" />,
        },
      ],
      packageStyle: "bg-[#59FFAC] border-black",
    },
  ];
  const contacts: IAdminContact[] = [
    {
      name: "Tegar Aji Pangestu",
      description: "contact person",
      noTelp: 6287721161214,
      igUsername: null,
      adminImage: "/hmti/hmti-tegar.webp",
      cardStyle: "bg-[#99B2FF] snap-center",
    },
    {
      name: "M. Nabil Nazhmi Kurniali",
      description: "contact person",
      noTelp: 6282328591635,
      igUsername: null,
      adminImage: "/hmti/hmti-nabil.webp",
      cardStyle: "bg-[#59FFAC] snap-center",
    },
  ];
  return (
    <div>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full h-auto md:h-auto lg:h-[700px] flex flex-col items-center gap-8 pt-20 pb-20 md:pt-28"
      >
        <div className="inline-flex border-1 border-black rounded-lg p-1 px-4 gap-1 items-center">
          <Image
            src="/hmti/logo-hmti.svg"
            width={20}
            height={20}
            alt="logo-hmti-udinus"
          />
          <h1 className="text-xs text-center">hmtiudinusproduct</h1>
        </div>
        <h1 className="text-4xl font-bold flex items-center text-center lg:px-[350px]">
          Easier to Make Certificate for Your Hectic Event
        </h1>
        <p className="text-center text-lg md:text-lg">
          wondering you just focus on your event without thinking in
          certification, think again!
        </p>
        <div className="flex flex-row justify-center gap-3">
          <PricingButton />
          <GetStartedButton />
        </div>
      </section>
      {/* Dashboard Section */}
      <section className="relative w-full h-auto justify-center items-center hidden lg:flex">
        <div className="absolute z-10 px-40 w-[1400px]">
          <DashboardView />
        </div>
        <Image
          src={"/landing-page-bg-1.png"}
          className="object-cover object-center w-full h-full "
          width={1000}
          height={1000}
          alt="landing-page-bg-1"
        />
      </section>
      {/* About Section */}
      <section className="w-full px-10 md:px-40 pb-20 pt-20 md:pt-52">
        <div className="flex flex-col items-center gap-12">
          <span id="about"></span>
          <Image
            src={"/certify/certify-logo-highlight-black.png"}
            className="object-cover object-center"
            width={130}
            height={130}
            alt="logo-hmti-udinus"
          />
          <h1 className="font-bold text-4xl">About</h1>
          <div className="flex flex-col gap-4 md:gap-3">
            <p className="font-normal text-lg md:text-lg text-center">
              Welcome to Certify – a smart and easy-to-use tool developed by the
              Informatics Student Association (HMTI) to help you generate QR
              Codes for certificates in just a few clicks.
            </p>
            <p className="font-normal text-lg md:text-lg text-center">
              Whether you&#39;re handling a seminar, training, or any kind of
              organizational event, Certify lets you create secure, unique QR
              Codes that link directly to certificate data. This makes it easier
              to verify authenticity, track participants, and maintain a
              professional standard without the hassle of manual work. Certify
              was built with practicality and user-friendliness in mind – no
              steep learning curve, no complicated setup, just quick results.
            </p>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section
        className="md:flex w-full px-10 md:px-20 lg:px-40 py-20"
        id="price"
      >
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-bold text-4xl text-center">Pricing</h1>
          <p className="text-center text-lg md:text-lg font-normal pb-7">
            Customize your event needs with our competitive and benefit-rich
            pricing packages.
          </p>
          <div className="w-full hidden md:grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4">
            {pricingPackage.map((packageData, index) => {
              return <PricingCard key={index} packageData={packageData} />;
            })}
          </div>
          <div className="md:hidden flex flex-row gap-2 w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2 px-4">
            {pricingPackage.map((packageData, index) => {
              return (
                <div key={index} className="flex-none w-[290px] snap-center">
                  <PricingCard packageData={packageData} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="md:block w-full px-10 md:px-20 lg:px-40 py-20"
      >
        <div className="flex flex-col gap-10 md:gap-36">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-4xl">Contact</h1>
            <p className="font-normal text-lg text-center">
              Contact us now and get special offers not available anywhere else.
            </p>
          </div>
          {/* Contact Card Desktop*/}
          <div className="hidden md:grid grid-cols-2 gap-5 md:gap-4 lg:gap-10 w-3/5 mx-auto">
            {contacts.map((contact, index) => {
              return (
                <ContactCard key={index} contacts={contact}>
                  <Image
                    src={contact.adminImage}
                    width={230}
                    height={250}
                    alt={contact.name}
                    className="relative md:-mt-52 lg:-mt-64 mx-auto "
                  />
                </ContactCard>
              );
            })}
          </div>
          {/* Contact Card Mobile */}
          <div className="md:hidden flex flex-col gap-3.5">
            {contacts.map((contact, index) => (
              <ContactCard contacts={contact} key={index}>
                <Image
                  src={contact.adminImage}
                  width={200}
                  height={100}
                  alt="admin-image"
                  className={contact.imageStyle}
                />
              </ContactCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
