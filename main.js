// Init javascript DOM
document.addEventListener('DOMContentLoaded', () => {

  const descriptionListPrint = document.querySelector('#descriptionListPrint')
  const listEmpty = document.querySelector('#listEmpty')

  const promedioSalaryBasic = document.querySelector('#promedioSalaryBasic')
  const mayorSalaryNeto = document.querySelector('#mayorSalaryNeto')
  const menorSalaryNeto = document.querySelector('#menorSalaryNeto')

  const smmlv = 1300000
  let salaryEmp = 0
  const daysMonth = 30
  const auxTransport = 162000
  let payForSalesCommission = 0
  let employeeHealthPay = 0
  let employeePensionPay = 0
  const employees = []

  // Salario por dias laborados
  function salaryDaysWorked(daysWorked, salaryEmployee) {
    salaryEmp = salaryEmployee
    
    return daysWorked * (salaryEmp / daysMonth)
  }

  // Comision por ventas
  function salesCommission(sales) {
    payForSalesCommission = sales * 0.05
    return payForSalesCommission
  }

  // Valor hora normal
  function normalTimeValue() {
    return (salaryEmp + payForSalesCommission) / 240
  }

  // Valor hora extra
  function extraHourValue() {
    return (normalTimeValue() * 0.25) + normalTimeValue()
  }

  // Ingreso por horas extras
  function extraHoursIncome(hours) {
    return hours * extraHourValue()
  }

  // Auxilio de transporte
  function transportAid() {
    return salaryEmp <= (2 * smmlv) ? true : false
  }

  // Salud del empleado
  function employeeHealth(daysWorked, salaryEmployee, sales, hours) {
    let totalSalary = salaryDaysWorked(daysWorked, salaryEmployee) + salesCommission(sales) + extraHoursIncome(hours)
    employeeHealthPay = totalSalary * 0.04
    return employeeHealthPay
  }

  // Pensión del empleado
  function employeePension(daysWorked, salaryEmployee, sales, hours) {
    let totalSalary = salaryDaysWorked(daysWorked, salaryEmployee) + salesCommission(sales) + extraHoursIncome(hours)
    employeePensionPay = totalSalary * 0.04
    return employeePensionPay
  }

  // Total ingresos
  function totalIncome(daysWorked, salaryEmployee, sales, hours) {
    let totalSalary = salaryDaysWorked(daysWorked, salaryEmployee) + salesCommission(sales) + extraHoursIncome(hours)

    return transportAid(salaryEmployee) ? totalSalary + auxTransport : totalSalary
  }

  // Total deducciones
  function totalDeductions(deductionsPrest) {
    return employeeHealthPay + employeePensionPay + deductionsPrest
  }

  // Neto a pagar
  function netPay(daysWorked, salaryEmployee, sales, hours, deductionsPrest) {
    return totalIncome(daysWorked, salaryEmployee, sales, hours) - totalDeductions(deductionsPrest)
  }

  // Crear funcion para que agregue las milésimas a los números
  function formatNumber(number) {
    return new Intl.NumberFormat().format(number)
  }
  
  // Validar todos los campos del formulario #employee-form
  const validateForm = (data) => {
    let validate = true
    for (const key in data) {
      if (data[key] === '') {
        validate = false
        break
      }
    }
    return validate
  }

  // Agregar empleado a la lista
  const addEmployeeToList = (data) => {
    const list = document.querySelector('#employee-lists')
    descriptionListPrint.classList.remove('d-none')
    listEmpty.classList.add('d-none')


    const item = `<li class="list-group-item d-flex justify-content-between align-items-center gap-3" id="${data.identificacionCard}">
      <span class="flex-grow-1">C.C. ${data.identificacionCard} - ${data.name}</span>
      <button class="btn btn-danger delete-employee">Eliminar</button>
      <button type="button" class="btn btn-primary print-payment">Imprimir</button>
    </li>`

    list.innerHTML += item

  }

  function generatePaymentSlip(idUser) {
    // Get the selected employee
    const selectedEmployee = getSelectedEmployee(idUser)
    // Generate the HTML table for the payment slip
    const tableContent = generateTableContent(selectedEmployee)
    // Generate the complete HTML content for the payment slip
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Desprendible de pago</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
          <main class="my-5">
            <div class="container">
              <div class="row text-center mb-5">
                <h1>Desprendible de pago</h1>
                <h3>Nombre: ${selectedEmployee.name}</h3>
                <h3>Identificación: ${selectedEmployee.identificacionCard}</h3>
              </div>
              <div class="row d-flex justify-content-center mb-5">
                ${tableContent}
              </div>
            </div>
          </main>

        </body>
      </html>
    `
    return htmlContent
  }

  function getSelectedEmployee(idUser) {
    const selectedEmployee = employees.find(employee => employee.identificacionCard == idUser)
    
    return selectedEmployee
  }

  function generateTableContent(employee) {
    const { daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest } = employee
    const tableRows = `
      <tr>
        <th scope="row">Salario básico</th>
        <td>${formatNumber(salaryDaysWorked(daysWorked, salaryEmployee))}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Auxilio de transporte</th>
        <td>${formatNumber(transportAid() ? auxTransport : 0)}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Días laborados</th>
        <td>${daysWorked}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Ventas</th>
        <td>${formatNumber(sales)}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Comisiones por ventas</th>
        <td>${formatNumber(salesCommission(sales))}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Horas extras</th>
        <td>${formatNumber(hoursExtras)}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Pago por horas extras</th>
        <td>${formatNumber(extraHoursIncome(hoursExtras))}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Salud</th>
        <td></td>
        <td>${formatNumber(employeeHealth(daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest))}</td>
      </tr>
      <tr>
        <th scope="row">Pensión</th>
        <td></td>
        <td>${formatNumber(employeePension(daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest))}</td>
      </tr>
      <tr>
        <th scope="row">Préstamos</th>
        <td></td>
        <td>${formatNumber(deductionsPrest)}</td>
      </tr>
      <tr>
        <th scope="row">Total pago y Descuento</th>
        <td><strong>${formatNumber(totalIncome(daysWorked, salaryEmployee , sales, hoursExtras))}</strong></td>
        <td><strong>${formatNumber(totalDeductions(deductionsPrest))}</strong></td>
      </tr>
      <tr>
        <th>Salario Neto a pagar</th>
        <td><strong>${formatNumber(netPay(daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest))}</strong></td>
        <td></td>
      </tr>
    `
    const tableContent = `
      <table class="table mb-5">
        <thead>
          <tr>
            <th scope="col">Concepto</th>
            <th scope="col">Ingresos</th>
            <th scope="col">Deducciones</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `
    return tableContent
  }

  const btnRegisterEmployee = document.querySelector('#employee-form .btn')

  // Validate form data employee
  btnRegisterEmployee.addEventListener('click', (e) => {
    e.preventDefault()
    const form = document.querySelector('#employee-form')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    
    if (validateForm(data)) {
      // Convertir los datos a tipo de dato correcto
      data.salaryEmployee = parseFloat(data.salaryEmployee)
      data.daysWorked = parseInt(data.daysWorked)
      data.sales = parseFloat(data.sales)
      data.hoursExtras = parseInt(data.hoursExtras)
      data.deductionsPrest = parseFloat(data.deductionsPrest)
      
      // Agregar el empleado a la lista de empleados
      employees.push(data)
      addEmployeeToList(data)

      const btnPrints = document.querySelectorAll('.print-payment')

      btnPrints.forEach(btnPrint => {
        btnPrint.addEventListener('click', (e) => {
          e.preventDefault()
          // Seleccionar el elemento padre li del boton que se le dio clic
          const idUser = e.target.parentElement.getAttribute('id')
      
          // Create a new window/tab
          const newWindow = window.open('', '_blank')
          // Generate the HTML content for the payment slip
          const htmlContent = generatePaymentSlip(idUser)
          // Write the HTML content to the new window/tab
          newWindow.document.write(htmlContent)
          // Close the document writing
          newWindow.document.close()
        })
      })

      // Mostrar mensaje de exito
      alert('Empleado registrado correctamente')

      // Limpiar los campos del formulario
      form.reset()

      // Mostrar el promedio del salario básico de los empleados
      showPromedioSalaryBasicEmployee()

      // Mostrar el mayor salario neto del salario básico de los empleados
      showMayorSalaryNeto()

      // Mostrar el menor salario neto del salario básico de los empleados
      if(employees.length > 1) {
        showMenorSalaryNeto()
      }


      // Agregar evento de eliminar el empleado de la lista
      const btnDelete = document.querySelectorAll('.delete-employee')
      btnDelete.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault()
          const idUser = e.target.parentElement.getAttribute('id')
          const index = employees.findIndex(employee => employee.identificacionCard == idUser)
          employees.splice(index, 1)
          e.target.parentElement.remove()

          if (employees.length == 0) {
            descriptionListPrint.classList.add('d-none')
            listEmpty.classList.remove('d-none')

            promedioSalaryBasic.textContent = ''
            mayorSalaryNeto.textContent = ''
            menorSalaryNeto.textContent = ''
            menorSalaryNeto.parentElement.classList.add('d-none')

          } else {
            // Mostrar el promedio del salario básico de los empleados
            showPromedioSalaryBasicEmployee()

            // Mostrar el mayor salario neto del salario básico de los empleados
            showMayorSalaryNeto()

            // Mostrar el menor salario neto del salario básico de los empleados
            if(employees.length > 1) {
              showMenorSalaryNeto()
            }else {
              menorSalaryNeto.parentElement.classList.add('d-none')
            }
          }
        })
      })

    } else {
      alert('Por favor, ingrese todos los campos')
    }

  })

  function showPromedioSalaryBasicEmployee() {
    promedioSalaryBasic.textContent = formatNumber(promedioSalaryBasicEmployee())
  }

  function showMayorSalaryNeto() {
    let { mayorSalary, nameEmployee } = calculateMayorSalaryneto()
    mayorSalaryNeto.textContent = `${formatNumber(mayorSalary)} - ${nameEmployee}`
  }

  function showMenorSalaryNeto() {
    let { menorSalary, nameEmployee } = calculateMenorSalaryneto()

    menorSalaryNeto.textContent = `${formatNumber(menorSalary)} - ${nameEmployee}`
    menorSalaryNeto.parentElement.classList.remove('d-none')
  }


  function promedioSalaryBasicEmployee() {
    let totalNeto = 0
    employees.forEach(employee => {
      const { daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest } = employee
      totalNeto += salaryDaysWorked(daysWorked, salaryEmployee)
      
    })
    
    return totalNeto / employees.length
  }

  function calculateMayorSalaryneto() {
    let mayorSalary = 0
    let nameEmployee = ''
    employees.forEach(employee => {
      const { name, daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest } = employee

      employeeHealth(daysWorked, salaryEmployee, sales, hoursExtras)
      employeePension(daysWorked, salaryEmployee, sales, hoursExtras)

      const neto = netPay(daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest)
      
      if (neto > mayorSalary) {
        mayorSalary = neto
        nameEmployee = name
      }
    })
    return {
      mayorSalary,
      nameEmployee
    }
  }

  function calculateMenorSalaryneto() {
    let menorSalary = 0
    let nameEmployee = ''
    employees.forEach(employee => {
      const { name, daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest } = employee

      employeeHealth(daysWorked, salaryEmployee, sales, hoursExtras)
      employeePension(daysWorked, salaryEmployee, sales, hoursExtras)

      const neto = netPay(daysWorked, salaryEmployee, sales, hoursExtras, deductionsPrest)

      if (menorSalary == 0 || neto < menorSalary) {
        menorSalary = neto
        nameEmployee = name
      }
    })
    return {
      menorSalary,
      nameEmployee
    }
  }




})

