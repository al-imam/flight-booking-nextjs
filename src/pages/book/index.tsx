import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect } from "react";

import { $post } from "$/utils";
import AirbusLogo from "$assets/temp/qatar-airways.jpg";
import { LeadPassenger, Nav } from "$components";
import { PassengerDetails } from "$components/Book/PassengerDetails";

import { SpinnerIcon } from "$icons";

import { usePassengers, useTripType } from "$store";
import { CalendarCheck2, PlaneLanding, PlaneTakeoff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "shadcn/components/ui/accordion";

function createArray(length: number | any) {
  if (typeof length !== "number" || isNaN(length)) return [];
  return Array(length)
    .fill(null)
    .map((_, i) => i + 1);
}

interface BookProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Book: FC<BookProps> = ({ ...rest }) => {
  const { passengers, flightBooking, FareDetails } = usePassengers();
  const { get } = useSearchParams();

  const currentStore = useTripType((store) => store.getCurrentStore());
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["booking"],
    mutationFn: async (data: any) => $post("privet/AirBook", data),
  });

  async function bookingHandler() {
    await mutateAsync({
      SearchID: get("searchId"),
      ResultID: get("resultId"),
      passengers: passengers,
    });
  }

  const sumCost = FareDetails?.reduce((acc, fare) => {
    const totalCost = fare.BaseFare + fare.Tax + fare.OtherCharges * fare.PassengerCount;
    return acc + totalCost;
  }, 0);
  const totalAdultPassengers = createArray(currentStore?.AdultQuantity! - 1);
  const totalChildPassengers = createArray(currentStore?.ChildQuantity);
  const totalInfantPassengers = createArray(currentStore?.InfantQuantity);
  const total = currentStore?.AdultQuantity! + currentStore?.ChildQuantity! + currentStore?.InfantQuantity!;

  return (
    <section {...rest} className="[--gap-x:1rem] [--gap-y:1rem]">
      <Nav />
      <div className="w-full  space-y-5 bg-slate-800 p-4 !pb-20 lg:p-8">
        <div>
          <h2 className=" p-5 text-2xl font-bold text-white">Complete Your Booking</h2>
          <div>
            <div className="    rounded-sm bg-gray-100">
              <div className="mx-3 my-5 py-5  shadow-lg  lg:py-8">
                <div className="flex flex-col justify-between space-y-10 p-8 sm:flex-row sm:items-center  sm:space-y-0">
                  <div>
                    <p className="text-2xl font-bold">
                      {flightBooking?.Origin?.Airport?.CityName} → {flightBooking?.Destination?.Airport?.CityName}
                    </p>
                    <div className="my-2  flex justify-between">
                      <p className="mb-2 mr-3 flex items-center  justify-center gap-x-1 rounded-sm p-1  font-semibold ">
                        <CalendarCheck2 size={18} />
                        {flightBooking?.Origin?.DepTime?.split("T")[0] || ""}
                      </p>
                    </div>
                  </div>
                  <div className="    rounded-sm bg-gray-100 ">
                    <div className="flex justify-between ">
                      <p className="text-base font-medium text-slate-700">Base Fare</p>
                      <p className="text-base font-medium text-slate-700">₹ 100</p>
                    </div>

                    <div className="mt-2 flex justify-between gap-x-2">
                      <p className="text-base font-medium text-slate-700">Taxes and Surcharges</p>
                      <p className="text-base font-medium text-slate-700">₹ 100</p>
                    </div>
                    <div className="h-[0.10rem] w-full rounded-lg  bg-gradient-to-l  from-teal-400 to-teal-700" />
                    <div className=" mt-2 flex justify-between">
                      <p className="text-base font-medium text-slate-700">Total Amount</p>
                      <p className="text-base font-medium text-slate-700">₹ 200</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10   space-y-8 rounded-lg  bg-gray-200 p-2 sm:mx-4  sm:p-6">
                  <div className="  flex items-center  gap-x-1  sm:gap-x-2  ">
                    <Image src={AirbusLogo} alt="Airbus Logo" className="h-10 w-10" />
                    <p className="font-semibold text-gray-600"> {flightBooking?.Airline?.AirlineName}</p>
                    <span className="rounded-full border border-gray-400 px-2 text-gray-400">
                      {flightBooking?.Airline?.AirlineCode}-{flightBooking?.Airline?.FlightNumber}
                    </span>
                  </div>

                  <div className="space-y-4 ">
                    <p className="flex items-center  gap-x-2 sm:gap-x-4">
                      <PlaneTakeoff />
                      <span className="font-bold">{flightBooking?.Origin?.Airport?.CityName}</span>
                      {flightBooking?.Origin?.Airport?.AirportName}
                    </p>
                    <p className="flex items-center   gap-x-2 sm:gap-x-4">
                      <PlaneLanding />
                      <span className="font-bold">{flightBooking?.Destination?.Airport?.CityName} </span>
                      {flightBooking?.Destination?.Airport?.AirportName}
                    </p>
                  </div>
                </div>
                <div className="mt-10   space-y-8 rounded-lg  bg-gray-200 p-2 sm:mx-4  sm:p-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="tablesItems ">Fare Summary</th>
                        <th className="tablesItems ">Base Fare</th>
                        <th className="tablesItems ">Tex + Fees</th>
                        <th className="tablesItems ">Per Passenger</th>
                        <th className="tablesItems ">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FareDetails.map((fare) => {
                        const totalOtherCharge = fare.Tax + fare.OtherCharges;
                        const totalCost = fare.BaseFare + fare.Tax + fare.OtherCharges * fare.PassengerCount;
                        return (
                          <tr>
                            <td className="tablesItems"> {fare.PaxType} </td>
                            <td className="tablesItems"> {fare.BaseFare} </td>
                            <td className="tablesItems"> {totalOtherCharge} </td>
                            <td className="tablesItems flex">
                              {fare.BaseFare + totalOtherCharge} X {fare.PassengerCount}
                            </td>
                            <td className="tablesItems font-bold">{totalCost}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td className="tablesItems font-bold">Total</td>
                        <td className="tablesItems font-bold"></td>
                        <td className="tablesItems font-bold"></td>
                        <td className="tablesItems font-bold"></td>
                        <td className="tablesItems font-bold">{sumCost}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-100 shadow-lg [--gap-x:2rem] [--gap-y:2rem]">
          <LeadPassenger />
        </div>

        {total > 1 && (
          <div>
            <div id="travelerDetails" className="space-y-8 rounded-lg bg-gray-100 px-4 py-8 shadow-lg lg:px-8">
              <p className="col-span-full text-2xl font-bold text-gray-800">Passenger details</p>

              {totalAdultPassengers.length > 0 && (
                <div>
                  <p>Adult</p>
                  <Accordion type="single" collapsible>
                    {totalAdultPassengers.map((item, i) => (
                      <AccordionItem
                        value={`value-${i}`}
                        key={`adult-${i}`}
                        className="my-2 rounded-lg bg-white shadow-lg"
                      >
                        <AccordionTrigger className="px-[var(--gap-x)] py-[var(--gap-y)] data-[state=open]:pb-0">
                          {(i + 1).toString().padStart(2, "0")}. Adult Passenger
                        </AccordionTrigger>
                        <AccordionContent>
                          <PassengerDetails index={i} paxType="Adult" />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {totalChildPassengers.length > 0 && (
                <div>
                  <p>Child</p>
                  <Accordion type="single" collapsible>
                    {totalChildPassengers.map((item, i) => (
                      <AccordionItem
                        value={`value-${i}`}
                        key={`child-${i}`}
                        className="my-2 rounded-lg bg-white shadow-lg"
                      >
                        <AccordionTrigger className="px-[var(--gap-x)] py-[var(--gap-y)] data-[state=open]:pb-0">
                          {(i + 1).toString().padStart(2, "0")}. Child Passenger
                        </AccordionTrigger>
                        <AccordionContent>
                          <PassengerDetails index={i} paxType="Child" />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {totalInfantPassengers.length > 0 && (
                <div>
                  <p>Infant</p>
                  <Accordion type="single" collapsible>
                    {totalInfantPassengers.map((_, i) => (
                      <AccordionItem
                        value={`value-${i}`}
                        key={`infant-${i}`}
                        className="my-2 rounded-lg bg-white shadow-lg"
                      >
                        <AccordionTrigger className="px-[var(--gap-x)] py-[var(--gap-y)] data-[state=open]:pb-0">
                          {(i + 1).toString().padStart(2, "0")}. Infant Passenger
                        </AccordionTrigger>
                        <AccordionContent>
                          <PassengerDetails index={i} paxType="Infant" />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={bookingHandler}
          className="mt-4 rounded-md bg-white px-10 py-2 text-xl font-semibold uppercase text-slate-800"
        >
          {!isPending ? "Continue" : <SpinnerIcon />}
        </button>
      </div>
    </section>
  );
};

export default Book;
