import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { TagByTypeComponent } from './tag-by-type/tag-by-type.component';
import { TagComponent } from './tag.component';
import { TagComponentService } from './tag.component.service';
import { TagRoutingModule } from './tag.routes';

@NgModule({
  declarations: [TagComponent, TagByTypeComponent],
  imports: [
    RouterModule,
    SharedModule,
    TagRoutingModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [TagComponentService]
})
export class TagModule {}
