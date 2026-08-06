import pyodbc
import traceback
cs = ('DRIVER={ODBC Driver 18 for SQL Server};'
      'SERVER=localhost\\MSSQLSERVERR;'
      'Trusted_Connection=yes;'
      'TrustServerCertificate=yes;')
print('conn=', cs)
try:
    cn = pyodbc.connect(cs, timeout=5)
    cur = cn.cursor()
    cur.execute('SELECT SUSER_SNAME()')
    print('login=', cur.fetchone()[0])
    cur.execute('SELECT name FROM sys.databases ORDER BY name')
    print('databases:')
    for row in cur.fetchall():
        print('-', row[0])
    cn.close()
except Exception:
    traceback.print_exc()
