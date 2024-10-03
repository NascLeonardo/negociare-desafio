import React, { useState } from "react";
import { deleteEmployees, updateEmployees } from "../libs/api/employees";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

interface Employee {
  id: number;
  name: string;
  days_worked: number;
  hour_cost: number;
  hours_worked: number;
}

interface EmployeeTableProps {
  employees: Employee[];
  fetchEmployees: () => Promise<void>; // Add this line
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, fetchEmployees }) => {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const handleDelete = async (id: number) => {
    const response = await deleteEmployees(id);
    if (response) {
      fetchEmployees(); // Refaz a tabela
      setAlertMessage("Funcionário deletado com sucesso!");
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
  };

  const openUpdateModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedEmployee) {
      const response = await updateEmployees(selectedEmployee.id, selectedEmployee);

      if (response) {
        fetchEmployees(); // Refaz a tabela
        setAlertMessage("Funcionário atualizado com sucesso!");
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

  return (
    <div className='overflow-x-auto'>
      {/* Alert Section */}
      {alertMessage && (
        <div className={`alert ${alertType === "success" ? "alert-success" : "alert-error"}`}>
          <div>
            <span>{alertMessage}</span>
          </div>
        </div>
      )}
      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>Nome</th>
            <th className='text-center'>Dias trabalhados</th>
            <th className='text-center'>Valor / Hora</th>
            <th className='text-center'>Horas trabalhadas </th>
            <th className='text-center'>Salário</th>
            <th className='text-center'>Ações</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td className='text-center'>{employee.days_worked}</td>
              <td className='text-center'>R$ {employee.hour_cost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</td>
              <td className='text-center'>{employee.hours_worked}</td>
              <td className='text-center'>
                R$ {(employee.hours_worked * employee.hour_cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
              </td>
              <td className='text-center'>
                <button className='btn btn-outline btn-error m-2' onClick={() => handleDelete(employee.id)}> Deletar </button>
                <button className='btn btn-outline btn-warning m-2' onClick={() => openUpdateModal(employee)}> Atualizar </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && selectedEmployee && (
        <div className='modal modal-open'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg'>Atualizar Funcionário</h3>
            <div className='py-4'>
              <label className='label'>Nome</label>
              <input type='text' value={selectedEmployee.name} onChange={e => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })} className='input input-bordered w-full' />

              <label className='label'>Dias trabalhados</label>
              <input type='number' value={selectedEmployee.days_worked} onChange={e => setSelectedEmployee({ ...selectedEmployee, days_worked: parseInt(e.target.value) })} className='input input-bordered w-full' />

              <label className='label'>Valor / Hora</label>
              <label className='input input-bordered flex items-center gap-2'>
                <FontAwesomeIcon icon={faDollarSign} className='h-4 w-4 opacity-70' />
                <input type='number' value={selectedEmployee.hour_cost} onChange={e => setSelectedEmployee({ ...selectedEmployee, hour_cost: parseFloat(e.target.value) })} className='input w-full' />
              </label>

              <label className='label'>Horas trabalhadas </label>
              <input type='number' value={selectedEmployee.hours_worked} onChange={e => setSelectedEmployee({ ...selectedEmployee, hours_worked: parseInt(e.target.value) })} className='input input-bordered w-full' />
            </div>

            <div className='modal-action'>
              <button className='btn btn-outline btn-error' onClick={() => setIsModalOpen(false)}> Cancelar</button>
              <button className='btn btn-outline btn-success' onClick={handleUpdate}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
