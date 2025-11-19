from openpyxl import load_workbook

wb = load_workbook('EXCEL-TEMPLATE-FINAL.xlsx')

print("\n🔍 Verificando referencias de dropdowns de TIPSTER...\n")

for sheet_name in ['Realizadas', 'Lanzadas Tipster']:
    ws = wb[sheet_name]
    print(f"📋 Hoja: {sheet_name}")
    
    # Encontrar la data validation de la columna B
    for dv in ws.data_validations.dataValidation:
        if 'B7' in str(dv.sqref):
            print(f"   Columna B (TIPSTER):")
            print(f"   ├─ Rango: {dv.sqref}")
            print(f"   ├─ Fórmula: {dv.formula1}")
            print(f"   └─ ✅ CORRECTO" if (
                (sheet_name == 'Realizadas' and 'Mis_Picks_Dashboard' in str(dv.formula1)) or
                (sheet_name == 'Lanzadas Tipster' and 'Tipster_Picks_Dashboard' in str(dv.formula1))
            ) else "   └─ ❌ INCORRECTO")
            print()
    
wb.close()
print("✅ Verificación completada")
