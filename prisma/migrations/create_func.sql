CREATE OR REPLACE FUNCTION calculate_route_distance(
    start_lat double precision,
    start_lng double precision,
    end_lat double precision,
    end_lng double precision
) RETURNS double precision AS
\$\$
    SELECT ST_Distance(
        ST_MakePoint(start_lng, start_lat)::geography,
        ST_MakePoint(end_lng, end_lat)::geography
    ) / 1000;
\$\$ LANGUAGE sql;