package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.dto.InvoiceDTO;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@Tag(name = "Invoice Controller", description = "APIs related to invoice management and payment")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @Operation(summary = "Get user invoices", description = "Retrieves a paginated list of invoices for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user invoices"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @GetMapping
    public ResponseEntity<ApiResponseWrapper> getUserInvoices(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        List<InvoiceDTO> invoices = invoiceService.getUserInvoices(userPrincipal, page, size, sortBy, sortDir);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "success", invoices));
    }

    @Operation(summary = "Get invoice by ID", description = "Retrieves an invoice by its ID for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the invoice"),
            @ApiResponse(responseCode = "404", description = "Invoice not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseWrapper> getInvoice(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(
                    description = "Car ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string")
            )
            @PathVariable ObjectId id) {
        InvoiceDTO invoice = invoiceService.getInvoiceById(userPrincipal, id);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "success", invoice));
    }
}
