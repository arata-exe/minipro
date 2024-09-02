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
    // Query to get the tbl_led value for id = 1
    const res = await client.query(
      'SELECT tbl_led FROM "TSN008" WHERE id = 1356'
    );

    if (res.rowCount === 0) {
      // No rows found with id = 1
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Return the tbl_led value
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
//------------------------------------------------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { smoke, ldr, vibration } = await req.json();
    const res = await client.query(
      'INSERT INTO "TSN008" (tbl_smoke, tbl_ldr, tbl_vibration) VALUES ($1, $2, $3) RETURNING *',
      [smoke, ldr, vibration]
    );
    return new Response(JSON.stringify(res.rows[0]), {
      status: 201,
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
//--------------------------------------------------------------------------------------------------------------------
export async function PUT(req: Request) {
  try {
    const { tbl_led } = await req.json();
    
    // Update the tbl_led field for id = 1
    const res = await client.query(
      'UPDATE "TSN008" SET tbl_led = $1 WHERE id = 1356 RETURNING *',
      [tbl_led]
    );

    if (res.rowCount === 0) {
      // No rows updated, ID may not exist
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

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
