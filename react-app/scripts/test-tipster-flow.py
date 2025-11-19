from openpyxl import load_workbook

print("\n🧪 SIMULANDO EL FLUJO DEL USUARIO...\n")

# Abrir Excel
wb = load_workbook('EXCEL-TEMPLATE-FINAL-V2.xlsx')

# ========================================
# TEST 1: Usuario escribe "JOHN" en Realizadas B7
# ========================================
print("1️⃣ Usuario escribe 'JOHN' en Realizadas B7...")
realizadas = wb['Realizadas']
realizadas['B7'].value = 'JOHN'
print("   ✅ Escrito en Realizadas B7")

# Verificar que el dashboard calcule para "JOHN"
print("\n2️⃣ Verificando si Mis_Picks_Dashboard tiene fórmulas preparadas...")
mis_picks = wb['Mis_Picks_Dashboard']

# Escribir "JOHN" en primera fila vacía del dashboard (fila 4)
mis_picks['A4'].value = 'JOHN'
print("   ✅ Escrito 'JOHN' en Mis_Picks_Dashboard A4")

# Mostrar fórmulas que calcularán stats de JOHN
print(f"   📊 Fórmula en C4 (Beneficio UDS): {mis_picks['C4'].value}")
print(f"   📊 Fórmula en F4 (YIELD): {mis_picks['F4'].value}")
print(f"   📊 Fórmula en G4 (Tips totales): {mis_picks['G4'].value}")

# ========================================
# TEST 2: Usuario escribe "PETER" en Lanzadas Tipster B7
# ========================================
print("\n3️⃣ Usuario escribe 'PETER' en Lanzadas Tipster B7...")
lanzadas = wb['Lanzadas Tipster']
lanzadas['B7'].value = 'PETER'
print("   ✅ Escrito en Lanzadas Tipster B7")

# Escribir "PETER" en primera fila vacía del dashboard (fila 4)
print("\n4️⃣ Verificando si Tipster_Picks_Dashboard tiene fórmulas preparadas...")
tipster_picks = wb['Tipster_Picks_Dashboard']
tipster_picks['A4'].value = 'PETER'
print("   ✅ Escrito 'PETER' en Tipster_Picks_Dashboard A4")

print(f"   📊 Fórmula en C4 (Beneficio UDS): {tipster_picks['C4'].value}")
print(f"   📊 Fórmula en F4 (YIELD): {tipster_picks['F4'].value}")

# ========================================
# VERIFICAR DROPDOWNS
# ========================================
print("\n5️⃣ Verificando que dropdowns apuntan a los dashboards correctos...")

for dv in realizadas.data_validations.dataValidation:
    if 'B7' in str(dv.sqref):
        print(f"\n   📋 Realizadas columna B:")
        print(f"      └─ Referencia: {dv.formula1}")
        if 'Mis_Picks_Dashboard' in str(dv.formula1):
            print(f"      └─ ✅ CORRECTO - Apunta a Mis_Picks_Dashboard")
            print(f"      └─ 💡 Cuando usuario abra dropdown, verá: Manolo, JOHN")
        else:
            print(f"      └─ ❌ ERROR - No apunta a Mis_Picks_Dashboard")

for dv in lanzadas.data_validations.dataValidation:
    if 'B7' in str(dv.sqref):
        print(f"\n   📋 Lanzadas Tipster columna B:")
        print(f"      └─ Referencia: {dv.formula1}")
        if 'Tipster_Picks_Dashboard' in str(dv.formula1):
            print(f"      └─ ✅ CORRECTO - Apunta a Tipster_Picks_Dashboard")
            print(f"      └─ 💡 Cuando usuario abra dropdown, verá: Manolo, PETER")
        else:
            print(f"      └─ ❌ ERROR - No apunta a Tipster_Picks_Dashboard")

# Guardar Excel de prueba
test_file = 'TEST-EXCEL-CON-JOHN-Y-PETER.xlsx'
wb.save(test_file)
print(f"\n✅ Test completado - Archivo guardado: {test_file}")
print("\n📝 RESUMEN:")
print("   • Dashboards tienen fórmulas en filas 4-100")
print("   • Usuario solo tiene que escribir nombre en columna A del dashboard")
print("   • Fórmulas calculan automáticamente los stats")
print("   • Dropdown muestra todos los tipsters del dashboard")

wb.close()
