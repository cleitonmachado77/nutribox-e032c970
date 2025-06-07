
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export const PatientShoppingTab = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Lista de Compras</h3>
        <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Nova Lista
        </Button>
      </div>
      <Card className="border-2 border-gray-200">
        <CardContent className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhuma lista de compras criada ainda.</p>
          <p className="text-gray-400 text-sm mt-2">Crie listas personalizadas baseadas no plano alimentar do paciente.</p>
        </CardContent>
      </Card>
    </>
  );
};
