
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  FolderOpen, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Eye,
  Star,
  LogOut
} from "lucide-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const studentStats = [
    { label: "Projetos no Portfólio", value: "0", icon: FolderOpen },
    { label: "Visualizações do Perfil", value: "0", icon: Eye },
    { label: "Candidaturas Enviadas", value: "0", icon: Briefcase },
    { label: "Taxa de Resposta", value: "0%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Portfólio Futuro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Olá, {user.user_metadata?.name || user.email}!</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao seu Dashboard!
          </h2>
          <p className="text-gray-600">
            Aqui você pode acompanhar seu progresso e gerenciar suas atividades.
          </p>
          <Badge variant="secondary" className="mt-2">
            {user.user_metadata?.role || 'STUDENT'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {studentStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Bem-vindo à plataforma!
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Primeiros Passos</span>
                  <Badge variant="secondary">Novo</Badge>
                </CardTitle>
                <CardDescription>
                  Complete seu perfil para começar a usar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={25} className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conta criada</span>
                    <span className="font-medium text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Perfil completo</span>
                    <span className="font-medium">Pendente</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primeiro projeto</span>
                    <span className="font-medium">Pendente</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Projects Yet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Seus Projetos</span>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum projeto ainda
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece criando seu primeiro projeto para mostrar suas habilidades
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Projeto
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Buscar Vagas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas para começar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium">Complete seu perfil</p>
                    <p className="text-gray-600">
                      Adicione uma bio e suas informações pessoais
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium">Crie seu primeiro projeto</p>
                    <p className="text-gray-600">
                      Mostre suas habilidades com projetos reais
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <p className="font-medium">Explore oportunidades</p>
                    <p className="text-gray-600">
                      Procure por vagas que combinam com você
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
