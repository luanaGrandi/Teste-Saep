from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.nome}'

class Tarefas(models.Model):
    descricao = models.TextField()
    nomeSetor = models.CharField(max_length=100)
    usuario = models.ForeignKey(Usuario,  on_delete=models.SET_NULL, null=True, blank=True)
    dataCadastro = models.DateField()

    PRIORIDADE_CHOICES = [
        ('B', 'Baixa'),
        ('M', 'Media'),
        ('A', 'Alta')

    ]
    prioridade = models.CharField(max_length=1, choices=PRIORIDADE_CHOICES, default='B')

    STATUS_CHOICES = [
        ('A fazer', 'A fazer'),
        ('Fazendo', 'Fazendo'),
        ('Pronto', 'Pronto')

    ]
    status = models.CharField(max_length=7, choices=STATUS_CHOICES, default='A fazer')

