
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [userRole, setUserRole] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Portfólio Futuro</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h2>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Acesse sua conta e continue construindo seu futuro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Eu sou...</Label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center space-x-2">
                      <span>🎓</span>
                      <span>Estudante</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="company">
                    <div className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>Empresa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="school">
                    <div className="flex items-center space-x-2">
                      <span>🏫</span>
                      <span>Instituição de Ensino</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Entrar
            </Button>

            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Esqueci minha senha
              </a>
              <div className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="text-blue-600 hover:text-blue-700 font-medium">
                  Cadastre-se aqui
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
