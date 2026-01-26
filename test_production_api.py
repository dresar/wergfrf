import requests
import json

BASE_URL = "https://backend.ekasyarifmaulana.biz.id/api"
API_KEY = "IbXz7SwTqqgfCNBcfxmOzr8v5f1DcMYlfK_xDW_Iqxw"

endpoints = [
    "/settings/",
    "/home-content/",
    "/about-content/",
    "/profile/",
    "/social-links/",
    "/skills/",
    "/skill-categories/",
    "/experience/",
    "/education/",
    "/projects/",
    "/certificates/",
    "/project-categories/",
    "/certificate-categories/",
    "/wa-templates/"
]

headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

print(f"Testing API at {BASE_URL}")
print(f"Using API Key: {API_KEY[:5]}...{API_KEY[-5:]}")
print("-" * 50)

success_count = 0
fail_count = 0

for endpoint in endpoints:
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.get(url, headers=headers, timeout=10)
        status_code = response.status_code
        
        if status_code == 200:
            print(f"[SUCCESS] {endpoint} - Status: {status_code}")
            success_count += 1
        else:
            print(f"[FAILED]  {endpoint} - Status: {status_code}")
            print(f"          Response: {response.text[:100]}")
            fail_count += 1
            
    except Exception as e:
        print(f"[ERROR]   {endpoint} - {str(e)}")
        fail_count += 1

print("-" * 50)
print(f"Total: {len(endpoints)}")
print(f"Success: {success_count}")
print(f"Failed: {fail_count}")
