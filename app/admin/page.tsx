import { CreateFeriaCardForm } from "@/features/feria/components/CreateFeriaCardForm";
import { RedeemFeriaCardForm } from "@/features/feria/components/RedeemFeriaCardForm";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <CreateFeriaCardForm />
        <RedeemFeriaCardForm />
      </div>
    </div>
  );
}
