<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkLogController extends Controller
{
    // GET /employees
    public function index(Request $request)
    {
        $amount = 10;
        $page = $request->input('page', 1);
        $query = $request->input('query', "");
        $orderBy = $request->input('orderBy', "");

        // Retorna o total de funcionários que se encaixam na consulta
        $totalEmployees = DB::table('employees')
            ->where('name', 'LIKE', '%' . $query . '%')
            ->count();

        // Total de pags que podem ser geradas por esta consulta
        $totalPages = ceil($totalEmployees / $amount);

        // Prepara a consulta para retornar os funcionários que serão exibidos
        $employeesQuery = DB::table('employees')
            ->where('name', 'LIKE', '%' . $query . '%');

        // Ordena pelo custo de horas caso o paramêtro tenha sido definido
        if (!empty($orderBy) && in_array($orderBy, ['asc', 'desc'])) {
            $employeesQuery->orderByRaw('(hour_cost * hours_worked) ' . $orderBy);
        }

        // Apply pagination
        $employees = $employeesQuery
            ->skip($amount * ($page - 1))
            ->take($amount)
            ->get();

        $data = [
            'employees' => $employees,
            'current_page' => $page,
            'total_employees' => $totalEmployees,
            'total_pages' => $totalPages,
        ];

        // Retorna todos os Funcionários com um status de sucesso
        return response()->json($data, 200);
    }


    // GET /employee/{id}
    public function show($id)
    {
        // Seleciona o funcionário pelo id
        $employee = Employee::find($id);

        // Caso não tenha retorno, retorna uma mensagem de erro com status de NotFound
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        // Caso tenha encontrado, retorna o objeto com status de sucesso
        return response()->json($employee, 200);
    }

    // POST /employee
    public function store(Request $request)
    {
        // Valida o request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days_worked' => 'required|integer|min:0',
            'hour_cost' => 'required|numeric|min:0',
            'hours_worked' => 'required|integer|min:0'
        ]);

        // Salva o objeto
        $employee = Employee::create($validated);

        // Retorna o objeto salvo com um status de sucesso
        return response()->json($employee, 201);
    }

    // PUT /Employee/{id}
    public function update(Request $request, $id)
    {
        // Seleciona o funcionário pelo id
        $employee = employee::find($id);

        // Caso não tenha retorno, retorna uma mensagem de erro com status de NotFound
        if (!$employee) {
            return response()->json(['message' => 'Work log not found'], 404);
        }

        // Valida o request
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'days_worked' => 'sometimes|required|integer|min:0',
            'hour_cost' => 'sometimes|required|numeric|min:0',
            'hours_worked' => 'required|numeric|min:0'
        ]);

        // Atualiza o objeto
        $employee->update($validated);

        // Retorna o objeto salvo com um status de sucesso
        return response()->json($employee, 200);
    }

    // DELETE /employee/{id}
    public function destroy($id)
    {
        // Seleciona o funcionário pelo id
        $employee = Employee::find($id);

        // Caso não tenha retorno, retorna uma mensagem de erro com status de NotFound
        if (!$employee) {
            return response()->json(['message' => 'Work log not found'], 404);
        }

        // Deleta o objeto
        $employee->delete();

        // Retorna o objeto salvo com um status de sucesso
        return response()->json(['message' => 'Work log deleted'], 200);
    }
}
