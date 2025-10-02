import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudOff, Eye, EyeOff, Lock, UserRound } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { z } from "zod";

import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "../hooks/useAuth";
import { useNetInfo } from "../hooks/useNetInfo";
import { useToast } from "../hooks/useToast";

const signInFormSchema = z.object({
  login: z.string().min(1, "Login obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export function SignIn() {
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
  const { isConnected } = useNetInfo();

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
        message: "Login ou senha inválidos.",
        variant: "error",
        duration: 5000,
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <VStack className="w-full flex-1 items-center justify-center bg-white px-[45px]">
          <Text className="font-poppins-bold text-5xl">BookTu</Text>
          <Text className="mt-14 font-inter text-2xl font-semibold">
            Iniciar sessão
          </Text>
          <VStack className="mt-14 w-full gap-7">
            <Controller
              name="login"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  isDisabled={!isConnected}
                  leftIcon={UserRound}
                  value={value}
                  onChangeText={onChange}
                  error={errors.login?.message}
                  className="group-data h-[50px] border-gray-500 bg-gray-300 px-4 data-[focus=true]:border-teal-700"
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
                  isDisabled={!isConnected}
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
                  className="h-[50px] border-gray-500 bg-gray-300 px-4 data-[focus=true]:border-teal-700"
                  label="Senha"
                  placeholder="******"
                  secureTextEntry={hidePassword}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                />
              )}
            />
            <Button
              isDisabled={!isConnected}
              isLoading={isLoading}
              onPress={handleSubmit(handleSignIn)}
              className="mt-16 h-14 bg-teal-700 data-[active=true]:bg-teal-600"
            >
              <Text className="font-inter text-xl font-bold text-white">
                Iniciar sessão
              </Text>
            </Button>
            {!isConnected && (
              <Alert
                className="rounded-md px-6 py-4"
                action="error"
                variant="solid"
              >
                <AlertIcon as={CloudOff} />
                <AlertText className="ml-auto">
                  Necessário conexão com a internet
                </AlertText>
              </Alert>
            )}
          </VStack>
        </VStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
