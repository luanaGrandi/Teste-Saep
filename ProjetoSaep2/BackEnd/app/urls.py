from django.urls import path
from .views import UsuarioRetrieveUpdateDestroy, TarefaListCreate, TarefaRetrieveUpdateDestroy, UsuarioListCreate

urlpatterns = [

    # Cadastro do usuario
    path('usuario/', UsuarioListCreate.as_view()),
    path('usuario/<int:pk>', UsuarioRetrieveUpdateDestroy.as_view()),

    # Tarefas
    path('tarefas/', TarefaListCreate.as_view()),
    path('tarefas/<int:pk>/', TarefaRetrieveUpdateDestroy.as_view())
]
