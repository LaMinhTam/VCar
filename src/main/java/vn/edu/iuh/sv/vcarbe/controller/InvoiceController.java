package vn.edu.iuh.sv.vcarbe.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.dto.InvoiceDTO;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;

import java.util.List;


@RestController
@RequestMapping("/invoices")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<ApiResponse> getUserInvoices(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        List<InvoiceDTO> invoices = invoiceService.getUserInvoices(userPrincipal, page, size, sortBy, sortDir);
        return ResponseEntity.ok(new ApiResponse(200, "success", invoices));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getInvoice(
            @CurrentUser UserPrincipal userPrincipal,
            @PathVariable ObjectId id) {
        InvoiceDTO invoice = invoiceService.getInvoiceById(userPrincipal, id);
        return ResponseEntity.ok(new ApiResponse(200, "success", invoice));
    }
}
