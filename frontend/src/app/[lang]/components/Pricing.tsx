"use client";
import {
  useGetUserQuery,
  useUpdatePricingPlanMutation,
} from "@/store/api/authApi";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { md5 } from "js-md5";

interface Feature {
  id: string;
  attributes: {
    name: string;
  };
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  pricePeriod: string;
  isRecommended: boolean;
  product_features: {
    data: Feature[];
  };
}

interface PriceProps {
  data: {
    id: string;
    title: string;
    plans: Plan[];
  };
}

export default function Pricing({ data }: PriceProps) {
  const isAuthenticated = useAppSelector((state) => state.main.isAuthenticated);
  const { data: user } = useGetUserQuery();
  const router = useRouter();
  const [updatePricingPlan] = useUpdatePricingPlanMutation();

  const handleClick =
    (pricingPlan: string, pricingPlanPrice: number) => async () => {
      if (isAuthenticated) {
        const agreed = confirm("Do you want to select this plan?");

        if (agreed) {
          try {
            if (pricingPlanPrice > 0) {
              const wayforpay = new (window as any).Wayforpay();
              const [firstName, secondName] = (user?.username || "").split(" ");
              const orderReference = Math.round(Math.random() * 10000);
              const orderDate = Date.now();
              wayforpay.run(
                {
                  merchantAccount:
                    "ec2_3_75_170_66_eu_central_1_compute_amazonaw",
                  merchantDomainName:
                    "http://ec2-3-75-170-66.eu-central-1.compute.amazonaws.com:3000/",
                  merchantTransactionSecureType: "AUTO",
                  merchantSignature: md5.hmac.hex(
                    "2e42e59eb892adcf764034a847dc281c4eab9cb2",
                    `ec2_3_75_170_66_eu_central_1_compute_amazonaw;http://ec2-3-75-170-66.eu-central-1.compute.amazonaws.com:3000/;${orderReference};${orderDate};${pricingPlanPrice};USD;${pricingPlan};1;${pricingPlanPrice}`
                  ),
                  orderReference: orderReference,
                  orderDate,
                  productName: [pricingPlan],
                  productPrice: [pricingPlanPrice],
                  productCount: [1],
                  amount: pricingPlanPrice,
                  currency: "USD",
                  clientFirstName: firstName,
                  clientLastName: secondName,
                  clientPhone: "380662392400",
                  clientEmail: user?.email,
                  language: "UA",
                },
                async function (response: any) {
                  console.log("success", response);
                  return await updatePricingPlan({
                    pricingPlan,
                    id: user?.id || 0,
                  }).unwrap();
                },
                function (response: any) {
                  console.log("error", response);
                }
              );
            } else {
              return await updatePricingPlan({
                pricingPlan,
                id: user?.id || 0,
              }).unwrap();
            }
          } catch (error) {
            return console.error(error);
          }
        }
        return console.error("User declined");
      }

      router.push("/en/login");
    };

  return (
    <section className="py-20 bg-black text-gray-100 m:py-12 lg:py-24">
      <div className="container px-4 mx-auto ">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <span className="font-bold tracking-wider uppercase text-blue-400">
            Pricing
          </span>
          <h2 className="text-4xl font-bold lg:text-5xl">{data.title}</h2>
        </div>
        <div className="flex flex-wrap items-stretch max-w-5xl mx-auto">
          {data.plans.map((plan: Plan) => (
            <div
              key={plan.id}
              className="w-full p-4 mb-8  sm:mx-40 lg:mx-0 lg:w-1/3 lg:mb-0"
            >
              <div
                className={`flex flex-col p-6 space-y-6 rounded shadow sm:p-8 min-h-[475px] min-w-[300px] ${
                  plan.isRecommended ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                <div className="space-y-2">
                  <h4 className="text-3xl font-bold mb-6">{plan.name}</h4>
                  <span className="text-6xl font-bold ">
                    {plan.price}$
                    <span
                      className={`ml-1 text-sm tracking-wid ${
                        plan.isRecommended ? "text-gray-900" : "text-blue-500"
                      }`}
                    >
                      /{plan.pricePeriod.toLowerCase()}
                    </span>
                  </span>
                </div>
                <p
                  className={`mt-3 leading-relaxed text-lg font-bold ${
                    plan.isRecommended ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {plan.description}
                </p>
                <ul
                  className={`flex-1 mb-6 ${
                    plan.isRecommended
                      ? "text-gray-900 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {plan.product_features.data.map((feature: Feature) => (
                    <li key={feature.id} className="flex mb-2 space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`flex-shrink-0 w-6 h-6 ${
                          plan.isRecommended ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>{feature.attributes.name}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`inline-block px-5 py-3 font-semibold tracking-wider text-center rounded   ${
                    plan.isRecommended
                      ? "bg-gray-900 text-blue-400 hover:bg-gray-700 hover:text-blue-300"
                      : "bg-blue-400 text-gray-900 hover:bg-gray-700 hover:text-blue-300"
                  }`}
                  onClick={handleClick(plan.name, plan.price)}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
