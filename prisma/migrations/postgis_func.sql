CREATE OR REPLACE FUNCTION calculate_route_distance(
    start_lat float8,
    start_lng float8,
    end_lat float8,
    end_lng float8
) RETURNS float8 AS
\\$
    SELECT ST_Distance(
        ST_SetSRID(ST_MakePoint(start_lng, start_lat), 4326)::geography,
        ST_SetSRID(ST_MakePoint(end_lng, end_lat), 4326)::geography
    ) / 1000;
\\$
LANGUAGE sql IMMUTABLE;