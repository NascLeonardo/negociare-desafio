// pages/employees.tsx
import React, { useEffect, useState } from 'react';
import { createEmployees, fetchEmployees } from '../libs/api/employees';
import EmployeeTable from '../components/EmployeeTable';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import next from 'next';

interface Employee {
  id: number;
  name: string;
  days_worked: number;
  hour_cost: number;
  hours_worked: number;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOrderBy, setSelectOrderBy] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [nextPage, setNextPage] = React.useState<Number | null>(null);
  const [previousPage, setPreviousPage] = React.useState<Number | null>(null);
  const [amountPage, setAmountPage] = React.useState<Number | null>(null);
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const loadEmployees = async (page: number = currentPage, query: string = searchInput, orderBy: string = selectOrderBy) => {
    setLoading(true);
    try {

      // Com base nas var do state realiza o get 
      const data = await fetchEmployees(page, query, selectOrderBy);

      // Define as vars para os botões da páginação
      if (data.total_pages > page) {
        setNextPage(page + 1);
      } else {
        setNextPage(null);
      }

      if (page > 1) {
        setPreviousPage(page - 1);
      } else {
        setPreviousPage(null);
      }

      setAmountPage(data.total_pages);
      setEmployees(data.employees);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Páginação
  const handlePageChange = async (page: number) => {
    // Inicia a func para retornar a lista do servidor async
    await loadEmployees(page);

    // Define a página que sera exibida
    setCurrentPage(page);
  };

  // Pesquisa
  const handleSearch = async () => {
    // Inicia a func para retornar a lista do servidor async
    await loadEmployees();
    // Corrige a páginação
    setCurrentPage(1);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Define o valor do state do select
    setSelectOrderBy(e.target.value ?? "");
  };

  // Cadastro
  const handleCreate = async () => {
    if (employee) {
      // Efetua o post
      const response = await createEmployees(employee);

      // Atualiza o alert
      if (response) {
        fetchEmployees(); // Refaz a tabela
        setAlertMessage("Funcionário salvo com sucesso!");
        setAlertType("success");
      } else {
        setAlertMessage("Erro! Tente novamente");
        setAlertType("error");
      }
      // Remove o alerta
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  // 
  useEffect(() => {
    loadEmployees(currentPage, searchInput, selectOrderBy);
  }, [selectOrderBy]);



  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Funcionários</h1>
      <button className='btn btn-outline btn-info m-2' onClick={() => openCreateModal()}> Cadastrar </button>
      {/* Alert Section */}
      {alertMessage && (
        <div className={`alert ${alertType === "success" ? "alert-success" : "alert-error"}`}>
          <div>
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Campo de pesquisa */}
        <label className="form-control w-full max-w select-xl">
          <div className="label">
            <span className="label-text">Pesquisar por nome: </span>
          </div>
          <div className="flex items-center space-x-2">
            <input onChange={e => setSearchInput(e.target.value)} value={searchInput} name="search" type="text" placeholder="Pesquisar..." className="input input-bordered w-full" />
            <button onClick={() => handleSearch()} className="btn btn-primary">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </label>

        {/* Select de ordenação */}
        <label className="form-control w-full max-w select-xl">
          <div className="label">
            <span className="label-text">Ordenar por :</span>
          </div>
          <select value={selectOrderBy} onChange={handleSelectChange} className="select select-bordered w-full">
            <option value=""></option>
            <option value="asc">Menor salário</option>
            <option value="desc">Maior salário</option>
          </select>
        </label>
      </div>


      {/* Tabela */}
      <EmployeeTable employees={employees} fetchEmployees={loadEmployees} />

      <div className="join grid grid-cols-2">
        <button className={`join-item btn btn-outline ${!previousPage ? 'btn-disabled' : ''}`} onClick={() => handlePageChange(previousPage)}> Página anterior </button>
        <button className={`join-item btn btn-outline ${!nextPage ? 'btn-disabled' : ''}`} onClick={() => handlePageChange(nextPage)}> Próxima página </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='modal modal-open'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg'>Novo Funcionário</h3>
            <div className='py-4'>
              <label className='label'>Nome</label>
              <input type='text' onChange={e => setEmployee({ ...employee, name: e.target.value } as Employee)} className='input input-bordered w-full' />

              <label className='label'>Dias trabalhados</label>
              <input type='number' onChange={e => setEmployee({ ...employee, days_worked: parseInt(e.target.value) } as Employee)} className='input input-bordered w-full' />

              <label className='label'>Valor / Hora</label>
              <label className='input input-bordered flex items-center gap-2'>
                <FontAwesomeIcon icon={faDollarSign} className='h-4 w-4 opacity-70' />
                <input type='number' onChange={e => setEmployee({ ...employee, hour_cost: parseFloat(e.target.value) } as Employee)} className='input w-full' />
              </label>

              <label className='label'>Horas trabalhadas </label>
              <input type='number' onChange={e => setEmployee({ ...employee, hours_worked: parseInt(e.target.value) } as Employee)} className='input input-bordered w-full' />
            </div>

            <div className='modal-action'>
              <button className='btn btn-outline btn-error' onClick={() => setIsModalOpen(false)}> Cancelar</button>
              <button className='btn btn-outline btn-success' onClick={handleCreate}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default EmployeesPage;
