
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Cadastro = () => {
  const { signUp, user, loading } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student fields
    bio: "",
    schoolName: "",
    city: "",
    // Company fields
    companyName: "",
    description: "",
    sector: "",
    companyCity: "",
    // School fields
    schoolCity: "",
    website: "",
    about: ""
  });

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const roleOptions = [
    {
      value: "STUDENT",
      label: "Estudante",
      icon: "🎓",
      description: "Crie seu portfólio e encontre oportunidades"
    },
    {
      value: "COMPANY", 
      label: "Empresa",
      icon: "🏢",
      description: "Descubra talentos locais qualificados"
    },
    {
      value: "SCHOOL_ADMIN",
      label: "Instituição de Ensino",
      icon: "🏫", 
      description: "Conecte seus alunos ao mercado"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!userRole) {
      alert("Selecione um perfil!");
      return;
    }

    setIsSubmitting(true);

    const userData = {
      name: formData.name,
      role: userRole as 'STUDENT' | 'COMPANY' | 'SCHOOL_ADMIN' | 'TEACHER',
      ...(userRole === 'STUDENT' && {
        bio: formData.bio,
        city: formData.city,
        school_name: formData.schoolName
      }),
      ...(userRole === 'COMPANY' && {
        companyName: formData.companyName,
        description: formData.description,
        sector: formData.sector,
        city: formData.companyCity,
        state: "SP" // Default para SP por enquanto
      }),
      ...(userRole === 'SCHOOL_ADMIN' && {
        schoolName: formData.about,
        city: formData.schoolCity,
        state: "SP", // Default para SP por enquanto
        website: formData.website
      })
    };

    const { error } = await signUp(formData.email, formData.password, userData);
    
    if (!error) {
      // Success handled by auth context
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
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
          <h2 className="text-3xl font-bold text-gray-900">Cadastre-se Gratuitamente</h2>
          <p className="text-gray-600">Escolha seu perfil e comece a transformar o futuro do trabalho</p>
        </div>

        {/* Role Selection */}
        {!userRole && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {roleOptions.map((role) => (
              <Card 
                key={role.value}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setUserRole(role.value)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{role.icon}</div>
                  <CardTitle className="text-xl">{role.label}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Escolher este perfil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Registration Form */}
        {userRole && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{roleOptions.find(r => r.value === userRole)?.icon}</span>
                    <span>Cadastro - {roleOptions.find(r => r.value === userRole)?.label}</span>
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados para criar sua conta
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setUserRole("")}
                >
                  Alterar perfil
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos comuns */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {/* Campos específicos por tipo de usuário */}
                {userRole === "STUDENT" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Sobre você (opcional)</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Conte um pouco sobre seus interesses e objetivos..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="school">Escola/Curso</Label>
                        <Input 
                          id="school" 
                          placeholder="Nome da sua escola ou curso"
                          value={formData.schoolName}
                          onChange={(e) => handleInputChange('schoolName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input 
                          id="city" 
                          placeholder="Sua cidade"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </>
                )}

                {userRole === "COMPANY" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input 
                        id="companyName" 
                        placeholder="Nome da sua empresa"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição da Empresa</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descreva sua empresa, setor de atuação..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sector">Setor</Label>
                        <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o setor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Tecnologia</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="commerce">Comércio</SelectItem>
                            <SelectItem value="services">Serviços</SelectItem>
                            <SelectItem value="industry">Indústria</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyCity">Cidade</Label>
                        <Input 
                          id="companyCity" 
                          placeholder="Cidade da empresa"
                          value={formData.companyCity}
                          onChange={(e) => handleInputChange('companyCity', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </>
                )}

                {userRole === "SCHOOL_ADMIN" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="about">Sobre a Instituição</Label>
                      <Textarea 
                        id="about" 
                        placeholder="Descreva a instituição, cursos oferecidos..."
                        value={formData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schoolCity">Cidade</Label>
                        <Input 
                          id="schoolCity" 
                          placeholder="Cidade da instituição"
                          value={formData.schoolCity}
                          onChange={(e) => handleInputChange('schoolCity', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Site (opcional)</Label>
                        <Input 
                          id="website" 
                          placeholder="https://www.escola.com.br"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando conta..." : "Criar Conta Gratuita"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Faça login aqui
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cadastro;
