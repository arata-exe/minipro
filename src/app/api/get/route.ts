import { NextResponse } from "next/server";
const { Client } = require("pg");
import dotenv from "dotenv";

dotenv.config();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // Query to fetch data from the "TSN008" table
    const res = await client.query('SELECT * FROM "TSN008" ORDER BY id DESC LIMIT 1');
    
    // Check if there is any data
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ message: "No data found" }), {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }
    
    // Return the latest data as a JSON response
    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}
