from rest_framework import serializers
from .models import Usuario, Tarefas

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email']

class TarefasSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)  # inclui os dados completos do usuário

    class Meta:
        model = Tarefas
        fields = ['id', 'descricao', 'nomeSetor', 'usuario', 'dataCadastro', 'prioridade', 'status']