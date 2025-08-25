from django.shortcuts import render
from .models import Usuario, Tarefas
from .serializers import UsuarioSerializer, TarefasSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from django.http import Http404
from rest_framework.response import Response

# clas para fazer a listagem das tarefas
class TarefaListCreate(ListCreateAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer

# class para fazer o crud das tarefas
class TarefaRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response ({'mensagem':"Tarefa excluida com sucesso!"})
    
    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise Http404({'Erro': 'tarefa não encontrada'})

# listagem
class UsuarioListCreate(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# fazer o cadastro de novos usuarios
class UsuarioRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response ({'mensagem':"Usuario excluido com sucesso!"})
    
    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise Http404({'Erro': 'Usuario não encontrado'})