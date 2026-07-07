// ======================================================
// src/lib/admin/api-client.ts
// Admin API Client
// ======================================================

export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export interface AdminApiOptions {
  accessToken: string
}

export class AdminApiClient {
  constructor(
    private options: AdminApiOptions
  ) {}

  //------------------------------------------------------
  // GET
  //------------------------------------------------------

  async get<T>(
    url: string
  ): Promise<T> {
    const res = await fetch(
      `/api/admin${url}`,
      {
        headers: {
          Authorization: `Bearer ${this.options.accessToken}`,
        },
      }
    )

    const json = await res.json()

    if (!res.ok) {
      throw new AdminApiError(
        json.error ?? "Unknown Error",
        res.status
      )
    }

    return json.data
  }

  //------------------------------------------------------
  // POST
  //------------------------------------------------------

  async post<T>(
    url: string,
    body: unknown
  ): Promise<T> {
    const res = await fetch(
      `/api/admin${url}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.options.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    const json = await res.json()

    if (!res.ok) {
      throw new AdminApiError(
        json.error ?? "Unknown Error",
        res.status
      )
    }

    return json.data
  }

  //------------------------------------------------------
  // PUT
  //------------------------------------------------------

  async put<T>(
    url: string,
    body: unknown
  ): Promise<T> {
    const res = await fetch(
      `/api/admin${url}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.options.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    const json = await res.json()

    if (!res.ok) {
      throw new AdminApiError(
        json.error ?? "Unknown Error",
        res.status
      )
    }

    return json.data
  }

  //------------------------------------------------------
  // DELETE
  //------------------------------------------------------

  async delete<T>(
    url: string
  ): Promise<T> {
    const res = await fetch(
      `/api/admin${url}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.options.accessToken}`,
        },
      }
    )

    const json = await res.json()

    if (!res.ok) {
      throw new AdminApiError(
        json.error ?? "Unknown Error",
        res.status
      )
    }

    return json.data
  }
}
