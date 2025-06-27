
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
  Users,
  Building2,
  GraduationCap,
  Star
} from "lucide-react";

const Dashboard = () => {
  // Simular dados do usuário - em produção viria do Supabase
  const userRole = "student"; // pode ser "student", "company" ou "school"
  const userName = "Ana Silva";

  const studentStats = [
    { label: "Projetos no Portfólio", value: "12", icon: FolderOpen },
    { label: "Visualizações do Perfil", value: "48", icon: Eye },
    { label: "Candidaturas Enviadas", value: "8", icon: Briefcase },
    { label: "Taxa de Resposta", value: "75%", icon: TrendingUp }
  ];

  const recentProjects = [
    {
      title: "Sistema de Vendas Online",
      skills: ["React", "Node.js", "MySQL"],
      validated: true,
      views: 23
    },
    {
      title: "App Mobile de Delivery",
      skills: ["React Native", "Firebase"],
      validated: false,
      views: 15
    },
    {
      title: "Dashboard Analítico",
      skills: ["Python", "Streamlit", "Pandas"],
      validated: true,
      views: 31
    }
  ];

  const recentOpportunities = [
    {
      title: "Estágio em Desenvolvimento Web",
      company: "TechSoft Solutions",
      location: "Sorocaba, SP",
      type: "Estágio",
      posted: "2 dias atrás"
    },
    {
      title: "Jovem Aprendiz - Design",
      company: "Criativa Marketing",
      location: "Sorocaba, SP", 
      type: "Jovem Aprendiz",
      posted: "1 semana atrás"
    }
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
            <span className="text-gray-600">Olá, {userName}!</span>
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
                <p className="text-xs text-green-600 mt-1">
                  +12% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Progresso do Portfólio</span>
                  <Badge variant="secondary">75% Completo</Badge>
                </CardTitle>
                <CardDescription>
                  Continue adicionando projetos para aumentar sua visibilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={75} className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projetos adicionados</span>
                    <span className="font-medium">12/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Habilidades cadastradas</span>
                    <span className="font-medium">8/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bio completa</span>
                    <span className="font-medium text-green-600">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Meus Projetos Recentes</span>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{project.title}</h4>
                            {project.validated && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                ✓ Validado
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            {project.views} visualizações
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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

            {/* Recent Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Oportunidades para Você</CardTitle>
                <CardDescription>
                  Baseado no seu perfil e habilidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOpportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h5 className="font-semibold text-sm text-gray-900 mb-1">
                        {opportunity.title}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        {opportunity.company}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{opportunity.location}</span>
                        <Badge variant="outline" className="text-xs">
                          {opportunity.type}
                        </Badge>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Ver Detalhes
                      </Button>
                    </div>
                  ))}
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
