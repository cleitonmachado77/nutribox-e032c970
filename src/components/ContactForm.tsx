
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfo {
  name: string;
  phone: string;
}

interface ContactFormProps {
  onSubmit: (info: ContactInfo) => void;
}

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSubmit({ name: name.trim(), phone: phone.trim() });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-gray-800">Bem-vindo!</h3>
        <p className="text-sm text-gray-600 mt-1">
          Para iniciarmos a conversa, preciso de algumas informações:
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Seu nome
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            WhatsApp
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            required
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={!name.trim() || !phone.trim()}
        >
          Iniciar Conversa
        </Button>
      </form>
    </div>
  );
};
