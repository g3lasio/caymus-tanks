"""
Script de validación de la lógica de cálculo de Caymus Tanks.

Este script verifica que la nueva lógica con exponente 2.2 produce
resultados correctos para casos conocidos.
"""

import math

# Constante calibrada
CAMPANA_EXPONENT = 2.2

def calculate_space_to_gallons(tank_data, espacio_en_pulgadas):
    """
    Calcula los galones de vino basándose en las pulgadas de espacio vacío.
    """
    gals_per_inch = tank_data["GALS_PER_INCH"]
    gals_in_top = tank_data["GALS_IN_TOP"]
    top_inches = tank_data["TOP_INCHES"]
    total_gals = tank_data["TOTAL_GALS"]
    
    if espacio_en_pulgadas <= top_inches:
        # CASO CAMPANA: Usar exponente 2.2
        ratio = espacio_en_pulgadas / top_inches
        top_section_gallons = gals_in_top * (ratio ** CAMPANA_EXPONENT)
        main_body_gallons = 0
        is_in_campana = True
    else:
        # CASO CUERPO: Fórmula estándar
        top_section_gallons = gals_in_top
        main_body_gallons = (espacio_en_pulgadas - top_inches) * gals_per_inch
        is_in_campana = False
    
    empty_gallons = top_section_gallons + main_body_gallons
    total_wine = total_gals - empty_gallons
    fill_percentage = (total_wine / total_gals) * 100
    
    return {
        "main_body_gallons": main_body_gallons,
        "top_section_gallons": top_section_gallons,
        "total_gallons": max(0, total_wine),
        "empty_gallons": max(0, empty_gallons),
        "fill_percentage": max(0, min(100, fill_percentage)),
        "is_in_campana": is_in_campana
    }

def calculate_gallons_to_space(tank_data, galones_deseados):
    """
    Calcula las pulgadas de espacio necesarias para tener X galones de vino.
    """
    gals_per_inch = tank_data["GALS_PER_INCH"]
    gals_in_top = tank_data["GALS_IN_TOP"]
    top_inches = tank_data["TOP_INCHES"]
    total_gals = tank_data["TOTAL_GALS"]
    
    galones_espacio = total_gals - galones_deseados
    
    if galones_espacio <= gals_in_top:
        # CASO CAMPANA: Fórmula inversa con exponente 2.2
        ratio = galones_espacio / gals_in_top
        top_section_inches = top_inches * (ratio ** (1 / CAMPANA_EXPONENT))
        main_body_inches = 0
        required_space = top_section_inches
        is_in_campana = True
    else:
        # CASO CUERPO: Fórmula estándar
        galones_cuerpo = galones_espacio - gals_in_top
        pulgadas_cuerpo = galones_cuerpo / gals_per_inch
        top_section_inches = top_inches
        main_body_inches = pulgadas_cuerpo
        required_space = top_section_inches + main_body_inches
        is_in_campana = False
    
    fill_percentage = (galones_deseados / total_gals) * 100
    
    return {
        "required_space": max(0, required_space),
        "main_body_inches": max(0, main_body_inches),
        "top_section_inches": max(0, top_section_inches),
        "fill_percentage": max(0, min(100, fill_percentage)),
        "is_in_campana": is_in_campana
    }

# ============================================================================
# CASOS DE PRUEBA
# ============================================================================

# Tanque F12 - Caso proporcionado por el usuario
F12 = {
    "GALS_PER_INCH": 44.678,
    "GALS_IN_TOP": 263.282,
    "TOP_INCHES": 19.90,
    "TOTAL_GALS": 6561.717
}

print("=" * 70)
print("VALIDACIÓN DE LA LÓGICA DE CÁLCULO - CAYMUS TANKS")
print("=" * 70)

# PRUEBA 1: Caso del usuario - F12 con 120 pulgadas de espacio
print("\n📋 PRUEBA 1: F12 con 120 pulgadas de espacio")
print("-" * 50)
result = calculate_space_to_gallons(F12, 120)
expected = 1826.17  # Valor calculado por el usuario

print(f"Espacio vacío: 120 pulgadas")
print(f"Galones en cuerpo vacío: {result['main_body_gallons']:.2f}")
print(f"Galones en campana vacía: {result['top_section_gallons']:.2f}")
print(f"Galones vacíos totales: {result['empty_gallons']:.2f}")
print(f"Galones de vino: {result['total_gallons']:.2f}")
print(f"Esperado: {expected:.2f}")
print(f"Diferencia: {abs(result['total_gallons'] - expected):.2f}")
print(f"✅ PASÓ" if abs(result['total_gallons'] - expected) < 1 else "❌ FALLÓ")

# PRUEBA 2: F12 con 5 pulgadas de espacio (en campana)
print("\n📋 PRUEBA 2: F12 con 5 pulgadas de espacio (en campana)")
print("-" * 50)
result = calculate_space_to_gallons(F12, 5)
expected_range = (10, 15)  # Experiencia del usuario: 10-15 galones vacíos

print(f"Espacio vacío: 5 pulgadas")
print(f"¿En campana?: {'Sí' if result['is_in_campana'] else 'No'}")
print(f"Galones vacíos: {result['empty_gallons']:.2f}")
print(f"Rango esperado: {expected_range[0]}-{expected_range[1]} galones")
print(f"Galones de vino: {result['total_gallons']:.2f}")
in_range = expected_range[0] <= result['empty_gallons'] <= expected_range[1]
print(f"✅ PASÓ" if in_range else "❌ FALLÓ")

# PRUEBA 3: Verificar que la fórmula inversa funciona
print("\n📋 PRUEBA 3: Verificación de fórmula inversa")
print("-" * 50)
# Si tenemos 1826.17 galones, deberíamos obtener ~120 pulgadas de espacio
result_inverse = calculate_gallons_to_space(F12, 1826.17)
print(f"Galones deseados: 1826.17")
print(f"Espacio calculado: {result_inverse['required_space']:.2f} pulgadas")
print(f"Esperado: ~120 pulgadas")
print(f"Diferencia: {abs(result_inverse['required_space'] - 120):.2f}")
print(f"✅ PASÓ" if abs(result_inverse['required_space'] - 120) < 1 else "❌ FALLÓ")

# PRUEBA 4: Verificar consistencia bidireccional en campana
print("\n📋 PRUEBA 4: Consistencia bidireccional en campana")
print("-" * 50)
# Calcular galones con 5 pulgadas, luego calcular pulgadas con esos galones
result1 = calculate_space_to_gallons(F12, 5)
result2 = calculate_gallons_to_space(F12, result1['total_gallons'])
print(f"Espacio inicial: 5 pulgadas")
print(f"Galones calculados: {result1['total_gallons']:.2f}")
print(f"Espacio recalculado: {result2['required_space']:.2f} pulgadas")
print(f"Diferencia: {abs(result2['required_space'] - 5):.4f}")
print(f"✅ PASÓ" if abs(result2['required_space'] - 5) < 0.01 else "❌ FALLÓ")

# PRUEBA 5: Casos límite
print("\n📋 PRUEBA 5: Casos límite")
print("-" * 50)

# Tanque lleno (0 pulgadas de espacio)
result_full = calculate_space_to_gallons(F12, 0)
print(f"Tanque lleno (0 pulgadas): {result_full['total_gallons']:.2f} galones")
print(f"Esperado: {F12['TOTAL_GALS']:.2f} galones")
print(f"✅ PASÓ" if abs(result_full['total_gallons'] - F12['TOTAL_GALS']) < 0.01 else "❌ FALLÓ")

# Exactamente en el límite de la campana
result_limit = calculate_space_to_gallons(F12, F12['TOP_INCHES'])
print(f"\nEn límite de campana ({F12['TOP_INCHES']} pulgadas):")
print(f"Galones vacíos: {result_limit['empty_gallons']:.2f}")
print(f"Esperado (GALS_IN_TOP): {F12['GALS_IN_TOP']:.2f}")
print(f"✅ PASÓ" if abs(result_limit['empty_gallons'] - F12['GALS_IN_TOP']) < 0.01 else "❌ FALLÓ")

print("\n" + "=" * 70)
print("RESUMEN DE VALIDACIÓN COMPLETADO")
print("=" * 70)
