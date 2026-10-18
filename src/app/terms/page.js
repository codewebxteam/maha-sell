import TermsAndConditionsPage from "../terms-and-conditions/page";

export const metadata = {
  title: "Terms of Service | Maha Sell",
  description: "Terms and conditions of service at Maha Sell.",
  alternates: {
    canonical: "https://mahasell.in/terms-and-conditions",
  },
};

export default function TermsPage() {
  return <TermsAndConditionsPage />;
}
