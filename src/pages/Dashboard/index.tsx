import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronsRight } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

import api from '../../services/api';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  fullName: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);

      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro ao buscar este repositório.');
    }
  }

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:reposiories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  return (
    <>
      <img src={logo} alt="Github explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <a key={repository.fullName} href="teste">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />

            <div>
              <strong>{repository.fullName}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronsRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
