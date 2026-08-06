import pyodbc
import traceback
print('python executable:', __import__('sys').executable)
print('pyodbc.version:', pyodbc.version)
print('available drivers:')
for d in pyodbc.drivers():
    print('-', d)
conn_str = (
    'DRIVER={ODBC Driver 18 for SQL Server};'
    'SERVER=localhost\\SQLEXPRESS;'
    'DATABASE=negoapp_db;'
    'UID=negoapp_user;'
    'PWD=Kadiri1441@;'
    'TrustServerCertificate=yes;'
)
print('connection string:', conn_str)
try:
    conn = pyodbc.connect(conn_str, timeout=5)
    print('Connection successful')
    conn.close()
except Exception:
    traceback.print_exc()
