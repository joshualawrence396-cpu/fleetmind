const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://fleetmind:fleetmind123@localhost:5432/fleetmind',
});

async function createPostGISFunction() {
  const client = await pool.connect();
  try {
    // Create the function
    await client.query(
      CREATE OR REPLACE FUNCTION get_distance(
        lat1 float8,
        lon1 float8,
        lat2 float8,
        lon2 float8
      ) RETURNS float8 AS
      \$\$
        SELECT ST_Distance(
          ST_MakePoint(lon1, lat1)::geography,
          ST_MakePoint(lon2, lat2)::geography
        ) / 1000;
      \$\$ LANGUAGE sql;
    );
    console.log('✅ Function created: get_distance');
    
    // Test the function
    const result = await client.query(
      SELECT get_distance(-33.9249, 18.4241, -33.9229, 18.3859) as distance
    );
    console.log(Test result:  km);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createPostGISFunction();
