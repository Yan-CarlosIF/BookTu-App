import { Text } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react-native";
import { useState } from "react";
import { InputIcon, InputSlot } from "@/components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../hooks/useToast";

const signInFormSchema = z.object({
  login: z.string().min(1, "Login obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export function SingIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const toast = useToast();
  const { signIn, isLoading } = useAuth();

  const [hidePassword, setHidePassword] = useState(true);

  async function handleSignIn({ login, password }: SignInFormData) {
    try {
      await signIn(login.trim(), password.trim());

      toast.show({
        message: "Login realizado com sucesso!",
        variant: "success",
      });
    } catch {
      toast.show({
        message: "Login ou senha inválidos.",
        variant: "error",
        closeButton: true,
        duration: 5000,
      });
    }
  }

  return (
    <VStack className="flex-1 w-full items-center justify-center px-[45px] bg-white">
      <Text className="text-5xl font-poppins-bold">BookTu</Text>
      <Text className="font-inter font-semibold text-2xl mt-14">
        Iniciar sessão
      </Text>
      <VStack className="mt-14 gap-7 w-full">
        <Controller
          name="login"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              leftIcon={UserRound}
              value={value}
              onChangeText={onChange}
              error={errors.login?.message}
              className="h-[50px] px-4 bg-gray-300 border-gray-500 group-data data-[focus=true]:border-teal-700"
              label="Login"
              placeholder="Login"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              leftIcon={Lock}
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              rightIcon={
                <InputSlot
                  onPress={() => setHidePassword((prevState) => !prevState)}
                >
                  <InputIcon as={hidePassword ? Eye : EyeOff} size={20} />
                </InputSlot>
              }
              className="h-[50px] px-4 bg-gray-300 border-gray-500 data-[focus=true]:border-teal-700"
              label="Senha"
              placeholder="******"
              secureTextEntry={hidePassword}
            />
          )}
        />
        <Button
          isLoading={isLoading}
          onPress={handleSubmit(handleSignIn)}
          className="bg-teal-700 h-14 mt-16 data-[active=true]:bg-teal-600"
        >
          <Text className="font-inter font-bold text-xl text-white">
            Iniciar sessão
          </Text>
        </Button>
      </VStack>
    </VStack>
  );
}
